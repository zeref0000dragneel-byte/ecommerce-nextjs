import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const category = await prisma.category.create({
      data: {
        name: 'Electrónica',
        slug: 'electronica',
      },
    });

    const product = await prisma.product.create({
      data: {
        name: 'Laptop HP Pavilion',
        slug: 'laptop-hp-pavilion',
        description: 'Laptop potente para programar',
        price: 15999.99,
        comparePrice: 18999.99,
        stock: 10,
        categoryId: category.id,
        imageUrl: 'https://via.placeholder.com/400',
      },
    });

    const customer = await prisma.customer.create({
      data: {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '5551234567',
        address: 'Calle Falsa 123',
        city: 'Oaxaca',
        state: 'Oaxaca',
        zipCode: '68000',
      },
    });

    const order = await prisma.order.create({
      data: {
        orderNumber: 'ORD-001',
        total: 15999.99,
        status: 'PAID',
        paymentMethod: 'Tarjeta',
        shippingAddress: 'Calle Falsa 123, Oaxaca',
        customerId: customer.id,
        items: {
          create: [
            {
              quantity: 1,
              price: 15999.99,
              productId: product.id,
            },
          ],
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: '¡Datos de prueba creados exitosamente! 🎉',
      data: {
        category,
        product,
        customer,
        order,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}