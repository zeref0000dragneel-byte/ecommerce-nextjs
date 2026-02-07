import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET /api/products - Listar todos los productos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId } : {},
      include: {
        category: true,
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/products - Crear producto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      comparePrice, // ⚠️ Viene del frontend como "comparePrice"
      stock,
      isPreOrder,
      preOrderDays,
      imageUrl,
      categoryId,
    } = body;

    // Validaciones básicas
    if (!name || !slug || !price || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const preOrder = Boolean(isPreOrder);
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        compareAtPrice: comparePrice ? parseFloat(comparePrice) : null, // ✅ CORRECTO
        images: imageUrl ? [imageUrl] : [], // ✅ CORRECTO (array)
        stock: preOrder ? null : (parseInt(stock) || 0),
        isPreOrder: preOrder,
        preOrderDays: preOrder ? (preOrderDays?.trim() || null) : null,
        categoryId,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al crear producto:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}