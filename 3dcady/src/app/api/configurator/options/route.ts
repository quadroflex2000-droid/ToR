import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/configurator/options
 * Retrieve option categories and values for a product type
 * 
 * Query Parameters:
 * - productType: 'kitchen' or 'wardrobe' (required)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productType = searchParams.get('productType');

    // Validate product type
    if (!productType) {
      return NextResponse.json(
        { error: 'Product type is required' },
        { status: 400 }
      );
    }

    if (productType !== 'kitchen' && productType !== 'wardrobe') {
      return NextResponse.json(
        { error: 'Invalid product type. Must be "kitchen" or "wardrobe"' },
        { status: 400 }
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

    if (!product.isActive) {
      return NextResponse.json(
        { error: `Product type "${productType}" is not currently available` },
        { status: 404 }
      );
    }

    // Get all option categories for this product type with their options
    const categories = await prisma.optionCategory.findMany({
      where: {
        productTypeId: product.id,
      },
      include: {
        options: {
          where: {
            isAvailable: true,
          },
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
      orderBy: {
        stepOrder: 'asc',
      },
    });

    // Transform to API response format
    const response = {
      productType: product.name,
      productDisplayName: product.displayName,
      categories: categories.map(category => ({
        id: category.id,
        name: category.name,
        title: category.title,
        stepOrder: category.stepOrder,
        isRequired: category.isRequired,
        allowsMultiple: category.allowsMultiple,
        conditionalDisplay: category.conditionalDisplay,
        options: category.options.map(option => ({
          id: option.id,
          name: option.name,
          description: option.description,
          imageUrl: option.imageUrl,
          priceFactor: option.priceFactor ? parseFloat(option.priceFactor.toString()) : null,
          specifications: option.specifications,
          displayOrder: option.displayOrder,
        })),
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching configurator options:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
