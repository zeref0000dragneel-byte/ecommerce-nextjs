import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Webhook recibido:', body);

    // MercadoPago envía notificaciones de tipo "payment"
    if (body.type === 'payment') {
      const paymentId = body.data.id;

      // Obtener información del pago desde MercadoPago
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          },
        }
      );

      if (!paymentResponse.ok) {
        console.error('Error al obtener datos del pago');
        return NextResponse.json({ error: 'Error al obtener pago' }, { status: 400 });
      }

      const payment = await paymentResponse.json();
      
      console.log('Datos del pago:', payment);

      // Buscar el pedido por orderNumber (external_reference)
      const order = await prisma.order.findFirst({
        where: { orderNumber: payment.external_reference },
      });

      if (!order) {
        console.error('Pedido no encontrado:', payment.external_reference);
        return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
      }

      // Actualizar el estado del pedido según el estado del pago
      let newStatus = order.status;

      if (payment.status === 'approved') {
        newStatus = 'PAID';
      } else if (payment.status === 'pending' || payment.status === 'in_process') {
        newStatus = 'PENDING';
      } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
        newStatus = 'CANCELLED';
      }

      // Actualizar el pedido
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: newStatus,
          paymentMethod: payment.payment_method_id,
          paymentId: payment.id.toString(),
        },
      });

      console.log(`Pedido ${order.orderNumber} actualizado a ${newStatus}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en webhook:', error);
    return NextResponse.json(
      { error: 'Error al procesar webhook' },
      { status: 500 }
    );
  }
}