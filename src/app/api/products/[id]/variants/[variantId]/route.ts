import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// PUT: Actualizar variante
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const { variantId } = await params;
    const body = await request.json();

    const { color, size, sku, price, stock, imageUrl, isActive } = body;

    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        color: color || null,
        size: size || null,
        sku: sku || null,
        price: price ? parseFloat(price) : null,
        stock: stock ? parseInt(stock) : 0,
        imageUrl: imageUrl || null,
        isActive: isActive !== undefined ? isActive : true,
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const { variantId } = await params;

    await prisma.productVariant.delete({
      where: { id: variantId },
    });

    return NextResponse.json({ message: 'Variante eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar variante:', error);
    return NextResponse.json(
      { error: 'Error al eliminar variante' },
      { status: 500 }
    );
  }
}