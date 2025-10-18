import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { ConfigurationData, ClientData } from '@/types';

/**
 * POST /api/configurator/submit
 * Submit completed configuration and create order request
 * 
 * Request Body:
 * - productType: 'kitchen' or 'wardrobe'
 * - configurationData: Complete configuration object
 * - clientData: Contact information (name, phone, email)
 * - notes: Optional additional notes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productType, configurationData, clientData, notes } = body;

    // Validate required fields
    if (!productType || !configurationData || !clientData) {
      return NextResponse.json(
        { error: 'Missing required fields: productType, configurationData, and clientData are required' },
        { status: 400 }
      );
    }

    // Validate product type
    if (productType !== 'kitchen' && productType !== 'wardrobe') {
      return NextResponse.json(
        { error: 'Invalid product type. Must be "kitchen" or "wardrobe"' },
        { status: 400 }
      );
    }

    // Validate client data
    const clientValidation = validateClientData(clientData);
    if (!clientValidation.valid) {
      return NextResponse.json(
        { error: 'Invalid client data', details: clientValidation.errors },
        { status: 400 }
      );
    }

    // Validate configuration data
    const configValidation = validateConfigurationData(configurationData, productType);
    if (!configValidation.valid) {
      return NextResponse.json(
        { error: 'Invalid configuration data', details: configValidation.errors },
        { status: 422 }
      );
    }

    // Get product type from database
    const product = await prisma.productType.findUnique({
      where: { name: productType },
    });

    if (!product) {
      return NextResponse.json(
        { error: `Product type "${productType}" not found` },
        { status: 404 }
      );
    }

    // Prepare configuration data with notes
    const completeConfigData: ConfigurationData = {
      ...configurationData,
      notes: notes || configurationData.notes,
    };

    // Create order request
    const orderRequest = await prisma.orderRequest.create({
      data: {
        productTypeId: product.id,
        status: 'SUBMITTED',
        clientData: clientData as any,
        configurationData: completeConfigData as any,
        submittedDate: new Date(),
      },
    });

    // TODO: Send email notifications (to be implemented in email service task)
    // - Send confirmation email to client
    // - Send notification email to admin/supplier

    return NextResponse.json({
      success: true,
      orderRequestId: orderRequest.id,
      message: 'Configuration submitted successfully. We will contact you shortly.',
      estimatedResponseTime: '24-48 hours',
    });
  } catch (error) {
    console.error('Error submitting configuration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Validate client data
 */
function validateClientData(clientData: any): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];

  if (!clientData.name || typeof clientData.name !== 'string' || clientData.name.trim().length === 0) {
    errors.push('Client name is required');
  }

  if (!clientData.phone || typeof clientData.phone !== 'string' || clientData.phone.trim().length === 0) {
    errors.push('Client phone number is required');
  }

  if (!clientData.email || typeof clientData.email !== 'string' || clientData.email.trim().length === 0) {
    errors.push('Client email is required');
  } else {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientData.email)) {
      errors.push('Invalid email format');
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validate configuration data
 */
function validateConfigurationData(
  configData: any,
  productType: string
): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];

  if (!configData.productType || configData.productType !== productType) {
    errors.push('Product type mismatch in configuration data');
  }

  if (!configData.selections || typeof configData.selections !== 'object') {
    errors.push('Configuration selections are required');
    return { valid: false, errors };
  }

  const selections = configData.selections;

  // Validate common required fields
  if (!selections.typeAndSize) {
    errors.push('Type and size selection is required');
  } else {
    if (!selections.typeAndSize.layoutType) {
      errors.push('Layout type is required');
    }
    if (!selections.typeAndSize.dimensions) {
      errors.push('Dimensions are required');
    }
  }

  if (!selections.style) {
    errors.push('Style selection is required');
  }

  if (!selections.corpusMaterial) {
    errors.push('Corpus material selection is required');
  }

  if (!selections.facadeMaterial) {
    errors.push('Facade material selection is required');
  }

  if (!selections.hardware) {
    errors.push('Hardware selection is required');
  }

  // Kitchen-specific validation
  if (productType === 'kitchen') {
    if (!selections.countertop) {
      errors.push('Countertop selection is required for kitchen');
    }
  }

  // Wardrobe-specific validation
  if (productType === 'wardrobe') {
    if (!selections.doorType) {
      errors.push('Door type is required for wardrobe');
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}
