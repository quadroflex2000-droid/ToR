import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/configurator/request/[id]
 * Retrieve a saved configuration by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order request ID is required' },
        { status: 400 }
      );
    }

    // Get order request with product type details
    const orderRequest = await prisma.orderRequest.findUnique({
      where: { id },
      include: {
        productType: true,
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    if (!orderRequest) {
      return NextResponse.json(
        { error: 'Order request not found' },
        { status: 404 }
      );
    }

    // Transform to API response format
    const response = {
      id: orderRequest.id,
      productType: orderRequest.productType.name,
      productDisplayName: orderRequest.productType.displayName,
      status: orderRequest.status,
      clientData: orderRequest.clientData,
      configurationData: orderRequest.configurationData,
      createdDate: orderRequest.createdDate,
      submittedDate: orderRequest.submittedDate,
      project: orderRequest.project ? {
        id: orderRequest.project.id,
        name: orderRequest.project.name,
        status: orderRequest.project.status,
      } : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching order request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
