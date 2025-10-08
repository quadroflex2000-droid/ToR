import pdf from 'pdf-parse';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { promises as fs } from 'fs';
import { extname } from 'path';

export interface ProcessedDocument {
  content: string;
  metadata: {
    pageCount?: number;
    wordCount: number;
    fileType: string;
    hasImages: boolean;
    hasTables: boolean;
  };
}

export async function processDocument(filePath: string): Promise<ProcessedDocument> {
  const fileExtension = extname(filePath).toLowerCase();
  
  switch (fileExtension) {
    case '.pdf':
      return processPDF(filePath);
    case '.docx':
      return processDOCX(filePath);
    case '.xlsx':
    case '.xls':
      return processXLSX(filePath);
    case '.txt':
      return processTXT(filePath);
    default:
      throw new Error(`Unsupported file type: ${fileExtension}`);
  }
}

async function processPDF(filePath: string): Promise<ProcessedDocument> {
  try {
    const buffer = await fs.readFile(filePath);
    const data = await pdf(buffer);
    
    return {
      content: data.text,
      metadata: {
        pageCount: data.numpages,
        wordCount: data.text.split(/\s+/).length,
        fileType: 'pdf',
        hasImages: false, // PDF parsing doesn't easily detect images
        hasTables: detectTables(data.text),
      },
    };
  } catch (error) {
    console.error('PDF processing error:', error);
    throw new Error('Failed to process PDF document');
  }
}

async function processDOCX(filePath: string): Promise<ProcessedDocument> {
  try {
    const buffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    
    return {
      content: result.value,
      metadata: {
        wordCount: result.value.split(/\s+/).length,
        fileType: 'docx',
        hasImages: false, // Basic extraction doesn't include images
        hasTables: detectTables(result.value),
      },
    };
  } catch (error) {
    console.error('DOCX processing error:', error);
    throw new Error('Failed to process DOCX document');
  }
}

async function processXLSX(filePath: string): Promise<ProcessedDocument> {
  try {
    const workbook = XLSX.readFile(filePath);
    let content = '';
    let totalCells = 0;
    
    // Process all worksheets
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      content += `\n--- Sheet: ${sheetName} ---\n`;
      
      jsonData.forEach((row: any[], rowIndex) => {
        if (row.length > 0) {
          const rowText = row.map(cell => cell?.toString() || '').join('\t');
          content += rowText + '\n';
          totalCells += row.filter(cell => cell !== undefined && cell !== '').length;
        }
      });
    });
    
    return {
      content,
      metadata: {
        wordCount: totalCells,
        fileType: 'xlsx',
        hasImages: false,
        hasTables: true, // XLSX is inherently tabular
      },
    };
  } catch (error) {
    console.error('XLSX processing error:', error);
    throw new Error('Failed to process XLSX document');
  }
}

async function processTXT(filePath: string): Promise<ProcessedDocument> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    return {
      content,
      metadata: {
        wordCount: content.split(/\s+/).length,
        fileType: 'txt',
        hasImages: false,
        hasTables: detectTables(content),
      },
    };
  } catch (error) {
    console.error('TXT processing error:', error);
    throw new Error('Failed to process TXT document');
  }
}

function detectTables(content: string): boolean {
  // Simple heuristics to detect table-like structures
  const lines = content.split('\n');
  let tableIndicators = 0;
  
  for (const line of lines) {
    // Check for tab-separated values
    if (line.includes('\t') && line.split('\t').length > 2) {
      tableIndicators++;
    }
    
    // Check for pipe-separated values
    if (line.includes('|') && line.split('|').length > 2) {
      tableIndicators++;
    }
    
    // Check for multiple spaces (common in aligned text)
    if (line.match(/\s{3,}/g)) {
      tableIndicators++;
    }
    
    // Check for common table headers
    if (line.toLowerCase().includes('quantity') || 
        line.toLowerCase().includes('description') ||
        line.toLowerCase().includes('item') ||
        line.toLowerCase().includes('unit')) {
      tableIndicators += 2;
    }
  }
  
  // If more than 20% of lines have table indicators, consider it has tables
  return tableIndicators > lines.length * 0.2;
}

export function validateFileType(filename: string): boolean {
  const allowedExtensions = ['.pdf', '.docx', '.xlsx', '.xls', '.txt'];
  const extension = extname(filename).toLowerCase();
  return allowedExtensions.includes(extension);
}

export function getFileType(filename: string): string {
  const extension = extname(filename).toLowerCase();
  const typeMap: Record<string, string> = {
    '.pdf': 'pdf',
    '.docx': 'docx',
    '.xlsx': 'xlsx',
    '.xls': 'xlsx',
    '.txt': 'txt',
  };
  return typeMap[extension] || 'unknown';
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  fileType: string
): Promise<string> {
  switch (fileType) {
    case 'pdf':
      const pdfData = await pdf(buffer);
      return pdfData.text;
      
    case 'docx':
      const docxResult = await mammoth.extractRawText({ buffer });
      return docxResult.value;
      
    case 'xlsx':
      const workbook = XLSX.read(buffer);
      let content = '';
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        content += `\n--- Sheet: ${sheetName} ---\n`;
        jsonData.forEach((row: any[]) => {
          if (row.length > 0) {
            content += row.map(cell => cell?.toString() || '').join('\t') + '\n';
          }
        });
      });
      return content;
      
    case 'txt':
      return buffer.toString('utf-8');
      
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}