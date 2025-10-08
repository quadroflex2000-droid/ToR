import OpenAI from 'openai';
import { ExtractedSpecificationItem, SpecificationCategory } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface DocumentAnalysisResult {
  extractedItems: ExtractedSpecificationItem[];
  confidence: number;
  processingNotes: string[];
  manualReviewRequired: boolean;
}

export async function analyzeDocumentContent(
  content: string,
  documentType: 'pdf' | 'docx' | 'xlsx' | 'txt'
): Promise<DocumentAnalysisResult> {
  try {
    const prompt = createAnalysisPrompt(content, documentType);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert interior design specification analyzer. Your task is to extract structured data from project documents and convert them into standardized specification items. Focus on:
          
          1. Item identification (furniture, lighting, materials, fixtures)
          2. Quantity extraction with proper units
          3. Technical specifications and requirements
          4. Category classification
          5. Quality and confidence assessment
          
          Always return valid JSON with high accuracy. If uncertain, mark for manual review.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 4000,
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error('No response from AI model');
    }

    // Parse the AI response
    const parsedResult = parseAIResponse(result);
    
    // Validate and enhance the results
    const validatedResult = validateAndEnhanceResult(parsedResult);
    
    return validatedResult;
  } catch (error) {
    console.error('AI analysis error:', error);
    
    // Fallback to basic text analysis
    return performBasicAnalysis(content);
  }
}

function createAnalysisPrompt(content: string, documentType: string): string {
  return `
Analyze the following ${documentType} document content and extract interior design specifications.

Document Content:
${content}

Please extract and return a JSON object with the following structure:
{
  "extractedItems": [
    {
      "name": "Item name",
      "quantity": number,
      "unit": "unit type (pcs, sqm, m, etc.)",
      "category": "FINISHING_MATERIALS | FURNITURE | LIGHTING | PLUMBING | ELECTRICAL | HVAC | CUSTOM",
      "specifications": {
        "dimensions": "if available",
        "material": "if specified",
        "color": "if specified",
        "finish": "if specified",
        "brand": "if specified",
        "model": "if specified",
        "additional_notes": "any other relevant specs"
      },
      "confidence": 0.0-1.0,
      "source_location": "page/section reference"
    }
  ],
  "confidence": 0.0-1.0,
  "processingNotes": ["any important observations"],
  "manualReviewRequired": boolean
}

Guidelines:
- Look for tables, lists, and structured content
- Extract quantities with proper units
- Identify materials, finishes, dimensions
- Categorize items appropriately
- Flag low-confidence extractions for manual review
- Include source references where possible
`;
}

function parseAIResponse(response: string): any {
  try {
    // Clean the response and extract JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw new Error('Invalid AI response format');
  }
}

function validateAndEnhanceResult(parsedResult: any): DocumentAnalysisResult {
  const extractedItems: ExtractedSpecificationItem[] = [];
  
  if (parsedResult.extractedItems && Array.isArray(parsedResult.extractedItems)) {
    for (const item of parsedResult.extractedItems) {
      if (item.name && typeof item.name === 'string') {
        extractedItems.push({
          name: item.name,
          quantity: parseFloat(item.quantity) || 1,
          unit: item.unit || 'pcs',
          category: validateCategory(item.category),
          specifications: item.specifications || {},
          confidence: Math.max(0, Math.min(1, parseFloat(item.confidence) || 0.5)),
          source_location: item.source_location || 'unknown',
        });
      }
    }
  }
  
  const avgConfidence = extractedItems.length > 0
    ? extractedItems.reduce((sum, item) => sum + item.confidence, 0) / extractedItems.length
    : 0;
  
  return {
    extractedItems,
    confidence: avgConfidence,
    processingNotes: parsedResult.processingNotes || [],
    manualReviewRequired: avgConfidence < 0.7 || extractedItems.length === 0,
  };
}

function validateCategory(category: string): SpecificationCategory {
  const validCategories: SpecificationCategory[] = [
    'FINISHING_MATERIALS',
    'FURNITURE',
    'LIGHTING',
    'PLUMBING',
    'ELECTRICAL',
    'HVAC',
    'CUSTOM',
  ];
  
  const upperCategory = category?.toUpperCase() as SpecificationCategory;
  return validCategories.includes(upperCategory) ? upperCategory : 'CUSTOM';
}

function performBasicAnalysis(content: string): DocumentAnalysisResult {
  // Basic fallback analysis using regex patterns
  const extractedItems: ExtractedSpecificationItem[] = [];
  const lines = content.split('\n');
  
  // Look for common patterns
  const itemPatterns = [
    /(\d+(?:\.\d+)?)\s*(pcs?|pieces?|sqm|m2|m|linear\s*m|lm)\s+(.+)/i,
    /(.+?)\s*[:\-]\s*(\d+(?:\.\d+)?)\s*(pcs?|pieces?|sqm|m2|m|linear\s*m|lm)/i,
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    for (const pattern of itemPatterns) {
      const match = line.match(pattern);
      if (match) {
        const [, quantityOrName, unitOrQuantity, nameOrUnit] = match;
        
        let quantity: number;
        let unit: string;
        let name: string;
        
        if (isNaN(parseFloat(quantityOrName))) {
          name = quantityOrName;
          quantity = parseFloat(unitOrQuantity);
          unit = nameOrUnit;
        } else {
          quantity = parseFloat(quantityOrName);
          unit = unitOrQuantity;
          name = nameOrUnit;
        }
        
        if (name && quantity && unit) {
          extractedItems.push({
            name: name.trim(),
            quantity,
            unit: unit.toLowerCase(),
            category: inferCategory(name),
            specifications: {},
            confidence: 0.6,
            source_location: `line ${i + 1}`,
          });
        }
        break;
      }
    }
  }
  
  return {
    extractedItems,
    confidence: 0.6,
    processingNotes: ['Used basic text analysis - AI processing failed'],
    manualReviewRequired: true,
  };
}

function inferCategory(itemName: string): SpecificationCategory {
  const name = itemName.toLowerCase();
  
  if (name.includes('chair') || name.includes('table') || name.includes('desk') || 
      name.includes('cabinet') || name.includes('sofa') || name.includes('bed')) {
    return 'FURNITURE';
  }
  
  if (name.includes('light') || name.includes('lamp') || name.includes('led') || 
      name.includes('chandelier') || name.includes('fixture')) {
    return 'LIGHTING';
  }
  
  if (name.includes('tile') || name.includes('paint') || name.includes('wallpaper') || 
      name.includes('floor') || name.includes('carpet') || name.includes('wood')) {
    return 'FINISHING_MATERIALS';
  }
  
  if (name.includes('sink') || name.includes('faucet') || name.includes('toilet') || 
      name.includes('shower') || name.includes('bath')) {
    return 'PLUMBING';
  }
  
  if (name.includes('outlet') || name.includes('switch') || name.includes('wire') || 
      name.includes('electrical')) {
    return 'ELECTRICAL';
  }
  
  return 'CUSTOM';
}