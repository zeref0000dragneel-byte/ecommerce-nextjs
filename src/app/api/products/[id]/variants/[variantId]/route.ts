import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// PUT: Actualizar variante (permite stock aunque el producto padre sea "sobre pedido")
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const { id: productId, variantId } = await params;
    const body = await request.json();

    const { color, size, sku, price, stock, imageUrl, isActive } = body;

    const existing = await prisma.productVariant.findFirst({
      where: { id: variantId, productId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Variante no encontrada' },
        { status: 404 }
      );
    }

    const stockValue = typeof stock === 'number' ? stock : parseInt(String(stock), 10);
    const validStock = !isNaN(stockValue) && stockValue >= 0 ? stockValue : 0;

    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        color: color || null,
        size: size || null,
        sku: sku || null,
        price: price != null && price !== '' ? parseFloat(String(price)) : null,
        stock: validStock,
        imageUrl: imageUrl || null,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json(variant);
  } catch (error) {
    console.error('Error al actualizar variante:', error);
    return NextResponse.json(
      { error: 'Error al actualizar variante' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar variante
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const { id: productId, variantId } = await params;

    const existing = await prisma.productVariant.findFirst({
      where: { id: variantId, productId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Variante no encontrada' },
        { status: 404 }
      );
    }

    await prisma.productVariant.delete({
      where: { id: variantId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar variante:', error);
    return NextResponse.json(
      { error: 'Error al eliminar variante' },
      { status: 500 }
    );
  }
}
