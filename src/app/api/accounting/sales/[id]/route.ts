import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await _request.json();
    const { status, clientName, paymentDate } = body;

    const validStatus = ['pagado', 'parcial', 'pendiente'].includes(status) ? status : undefined;

    const sale = await prisma.accountingSale.update({
      where: { id },
      data: {
        ...(validStatus != null && { status: validStatus }),
        ...(clientName !== undefined && { clientName: clientName ? String(clientName) : null }),
        ...(paymentDate !== undefined && { paymentDate: paymentDate ? new Date(paymentDate) : null }),
      },
      include: { externalItem: true },
    });

    return NextResponse.json({ success: true, data: sale });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al actualizar venta';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
