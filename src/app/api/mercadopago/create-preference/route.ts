import { NextRequest, NextResponse } from 'next/server';
import { preferenceClient, MP_CONFIG } from '@/app/lib/mercadopago';
import prisma from '@/app/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    // Obtener el pedido con sus items y cliente
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    // Crear items para MercadoPago
    const items = order.items.map((item) => ({
      id: item.productId,
      title: item.product.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: 'MXN',
    }));

    // Crear preferencia de pago
    const preference = await preferenceClient.create({
      body: {
        items,
        payer: {
          name: order.customer.name,
          email: order.customer.email,
          phone: {
            number: order.customer.phone || '',
          },
          address: {
            street_name: order.customer.address || '',
            zip_code: order.customer.zipCode || '',
          },
        },
        back_urls: {
          success: `${MP_CONFIG.backUrls.success}?orderId=${orderId}`,
          failure: `${MP_CONFIG.backUrls.failure}?orderId=${orderId}`,
          pending: `${MP_CONFIG.backUrls.pending}?orderId=${orderId}`,
        },
        auto_return: 'approved',
        notification_url: MP_CONFIG.notificationUrl,
        external_reference: order.orderNumber,
        statement_descriptor: 'MI E-COMMERCE',
      },
    });

    // Guardar el ID de preferencia en el pedido
    await prisma.order.update({
      where: { id: orderId },
      data: { mercadoPagoId: preference.id },
    });

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
    });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    return NextResponse.json(
      { error: 'Error al crear preferencia de pago' },
      { status: 500 }
    );
  }
}