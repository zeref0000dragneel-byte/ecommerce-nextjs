import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const sales = await prisma.accountingSale.findMany({
      include: {
        externalItem: true,  // Solo incluir externalItem (product no está definido en el modelo)
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: sales });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al listar ventas';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      productId,
      externalItemId,
      quantity,
      amount,
      status = 'pagado',
      clientName,
      paymentDate
    } = body;

    // Validaciones
    if (quantity == null || amount == null) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios: quantity, amount' },
        { status: 400 }
      );
    }

    if (!productId && !externalItemId) {
      return NextResponse.json(
        { success: false, error: 'Debe indicar productId o externalItemId' },
        { status: 400 }
      );
    }

    // Validar status
    const validStatus = ['pagado', 'parcial', 'pendiente'].includes(status)
      ? status
      : 'pagado';

    // Crear la venta
    const sale = await prisma.accountingSale.create({
      data: {
        productId: productId || null,
        externalItemId: externalItemId || null,
        quantity: Number(quantity),
        amount: Number(amount),
        status: validStatus,
        clientName: clientName ? String(clientName) : null,
        paymentDate: paymentDate ? new Date(paymentDate) : null,
      },
      include: {
        externalItem: true,  // Solo incluir externalItem
      },
    });

    // Solo actualizar stock si el producto NO es "sobre pedido" (stock !== null)
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (product && product.stock !== null) {
        await prisma.product.update({
          where: { id: productId },
          data: {
            stock: product.stock - Number(quantity),
          },
        });
      }
    }

    return NextResponse.json({ success: true, data: sale });
  } catch (error: unknown) {
    console.error('Error en POST /api/accounting/sales:', error);
    const message = error instanceof Error ? error.message : 'Error al crear venta';
    return NextResponse.json(
      {
        success: false,
        error: message,
        details: 'Verifica que los datos enviados sean correctos y que el producto exista'
      },
      { status: 500 }
    );
  }
}
