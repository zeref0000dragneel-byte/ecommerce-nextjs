import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET: Obtener variantes de un producto
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const variants = await prisma.productVariant.findMany({
      where: { productId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(variants);
  } catch (error) {
    console.error('Error al obtener variantes:', error);
    return NextResponse.json(
      { error: 'Error al obtener variantes' },
      { status: 500 }
    );
  }
}

// POST: Crear nueva variante
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { color, size, sku, price, stock, imageUrl } = body;

    // Validaciones
    if (!color && !size) {
      return NextResponse.json(
        { error: 'Debe especificar al menos color o talla' },
        { status: 400 }
      );
    }

    // Verificar que el producto existe (las variantes pueden tener stock aunque el padre sea "sobre pedido")
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    const stockValue = typeof stock === 'number' ? stock : parseInt(String(stock), 10);
    const validStock = !isNaN(stockValue) && stockValue >= 0 ? stockValue : 0;

    // Crear la variante (siempre permitir stock independiente del producto padre)
    const variant = await prisma.productVariant.create({
      data: {
        productId: id,
        color: color || null,
        size: size || null,
        sku: sku || null,
        price: price != null && price !== '' ? parseFloat(String(price)) : null,
        stock: validStock,
        imageUrl: imageUrl || null,
        isActive: body.isActive !== false,
      },
    });

    return NextResponse.json(variant, { status: 201 });
  } catch (error) {
    console.error('Error al crear variante:', error);
    return NextResponse.json(
      { error: 'Error al crear variante' },
      { status: 500 }
    );
  }
}