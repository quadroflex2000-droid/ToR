import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { getCurrentUser, getSubscriptionLimits } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { processDocument } from '@/lib/file-processing/document-processor';
import { analyzeDocumentContent } from '@/lib/ai/document-analyzer';
import { AI_CONFIDENCE_THRESHOLD } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if user has AI analysis access
    const limits = getSubscriptionLimits(user.subscriptionPlan);
    if (!limits.aiDocumentAnalysis) {
      return NextResponse.json(
        { error: 'AI document analysis requires a Pro or Business subscription' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { fileIds, projectId, analysisType = 'specification_extraction' } = body;

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json({ error: 'No file IDs provided' }, { status: 400 });
    }

    // Validate project access
    if (projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          OR: [
            { ownerId: user.id },
            { permissions: { some: { userId: user.id } } },
          ],
        },
      });

      if (!project) {
        return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
      }
    }

    const analysisResults = [];

    for (const fileId of fileIds) {
      try {
        // Get file info
        const file = await prisma.fileUpload.findFirst({
          where: {
            id: fileId,
            uploadedBy: user.id,
          },
        });

        if (!file) {
          analysisResults.push({
            fileId,
            success: false,
            error: 'File not found or access denied',
          });
          continue;
        }

        // Check if analysis already exists
        const existingAnalysis = await prisma.documentAnalysisJob.findFirst({
          where: {
            fileId,
            status: 'COMPLETED',
          },
        });

        if (existingAnalysis) {
          analysisResults.push({
            fileId,
            success: true,
            analysisId: existingAnalysis.id,
            cached: true,
            results: existingAnalysis.results,
          });
          continue;
        }

        // Create analysis job
        const analysisJob = await prisma.documentAnalysisJob.create({
          data: {
            projectId: projectId || file.projectId!,
            fileId,
            status: 'PROCESSING',
            analysisType: analysisType.toUpperCase() as any,
            startedDate: new Date(),
          },
        });

        try {
          // Process the document
          const filePath = join(process.cwd(), 'uploads', file.storedName);
          const processedDoc = await processDocument(filePath);

          // Analyze with AI
          const fileType = file.originalName.split('.').pop()?.toLowerCase() as any;
          const analysis = await analyzeDocumentContent(processedDoc.content, fileType);

          // Update analysis job with results
          const updatedJob = await prisma.documentAnalysisJob.update({
            where: { id: analysisJob.id },
            data: {
              status: 'COMPLETED',
              completedDate: new Date(),
              results: analysis as any,
            },
          });

          analysisResults.push({
            fileId,
            success: true,
            analysisId: updatedJob.id,
            cached: false,
            results: analysis,
            confidence: analysis.confidence,
            manualReviewRequired: analysis.manualReviewRequired,
          });

          // If analysis is high quality, create specification items
          if (analysis.confidence >= AI_CONFIDENCE_THRESHOLD && projectId) {
            await createSpecificationFromAnalysis(projectId, analysis, user.id);
          }
        } catch (processingError) {
          console.error(`Analysis failed for file ${fileId}:`, processingError);

          // Update job as failed
          await prisma.documentAnalysisJob.update({
            where: { id: analysisJob.id },
            data: {
              status: 'FAILED',
              completedDate: new Date(),
              errorMessage: processingError instanceof Error 
                ? processingError.message 
                : 'Unknown processing error',
            },
          });

          analysisResults.push({
            fileId,
            success: false,
            error: 'Analysis processing failed',
          });
        }
      } catch (error) {
        console.error(`Error processing file ${fileId}:`, error);
        analysisResults.push({
          fileId,
          success: false,
          error: 'Processing error',
        });
      }
    }

    return NextResponse.json({
      message: 'Analysis completed',
      results: analysisResults,
      successCount: analysisResults.filter(r => r.success).length,
      totalCount: analysisResults.length,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function createSpecificationFromAnalysis(
  projectId: string,
  analysis: any,
  userId: string
) {
  try {
    // Create a technical specification from the analysis
    const spec = await prisma.technicalSpecification.create({
      data: {
        projectId,
        category: 'CUSTOM', // Will be updated based on items
        name: 'AI Extracted Specification',
        description: 'Automatically generated from document analysis',
        status: 'DRAFT',
        createdBy: userId,
      },
    });

    // Create specification items
    for (const [index, item] of analysis.extractedItems.entries()) {
      await prisma.specificationItem.create({
        data: {
          specId: spec.id,
          name: item.name,
          description: item.specifications ? JSON.stringify(item.specifications) : undefined,
          quantity: item.quantity,
          unit: item.unit,
          specifications: item.specifications,
          order: index,
        },
      });
    }

    return spec;
  } catch (error) {
    console.error('Error creating specification from analysis:', error);
    // Don't throw - this is optional
  }
}