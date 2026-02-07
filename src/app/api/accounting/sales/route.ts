import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const sales = await prisma.accountingSale.findMany({
      include: { externalItem: true },
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
    const { productId, externalItemId, quantity, amount, status, clientName, paymentDate } = body;
    if (quantity == null || amount == null) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos: quantity, amount' },
        { status: 400 }
      );
    }
    if (!productId && !externalItemId) {
      return NextResponse.json(
        { success: false, error: 'Debe indicar productId o externalItemId' },
        { status: 400 }
      );
    }
    const validStatus = ['pagado', 'parcial', 'pendiente'].includes(status) ? status : 'pagado';
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
      include: { externalItem: true },
    });

    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (product) {
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
    const message = error instanceof Error ? error.message : 'Error al crear venta';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
