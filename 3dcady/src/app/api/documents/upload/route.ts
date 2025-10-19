import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getCurrentUser, checkSubscriptionLimit } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { validateFileType, getFileType } from '@/lib/file-processing/document-processor';
import { MAX_FILE_SIZE_BYTES, ALLOWED_FILE_TYPES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check storage limits
    const canUpload = await checkSubscriptionLimit(user.id, 'maxFileStorageGB');
    if (!canUpload) {
      return NextResponse.json(
        { error: 'Storage limit exceeded. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const projectId = formData.get('projectId') as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
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

    const uploadResults = [];
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    for (const file of files) {
      try {
        // Validate file
        if (file.size > MAX_FILE_SIZE_BYTES) {
          uploadResults.push({
            filename: file.name,
            success: false,
            error: 'File size exceeds limit',
          });
          continue;
        }

        if (!validateFileType(file.name) || !ALLOWED_FILE_TYPES.includes(file.type)) {
          uploadResults.push({
            filename: file.name,
            success: false,
            error: 'Unsupported file type',
          });
          continue;
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2);
        const extension = file.name.split('.').pop();
        const storedName = `${timestamp}_${randomString}.${extension}`;
        const filePath = join(uploadsDir, storedName);

        // Save file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Save to database
        const fileUpload = await prisma.fileUpload.create({
          data: {
            originalName: file.name,
            storedName,
            url: `/uploads/${storedName}`,
            sizeBytes: BigInt(file.size),
            mimeType: file.type,
            uploadedBy: user.id,
            projectId: projectId || null,
          },
        });

        uploadResults.push({
          id: fileUpload.id,
          filename: file.name,
          success: true,
          url: fileUpload.url,
          size: file.size,
          type: getFileType(file.name),
        });
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        uploadResults.push({
          filename: file.name,
          success: false,
          error: 'Upload failed',
        });
      }
    }

    return NextResponse.json({
      message: 'Upload completed',
      results: uploadResults,
      successCount: uploadResults.filter(r => r.success).length,
      totalCount: uploadResults.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}