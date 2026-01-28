import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    // Obtener la categoría existente
    let category = await prisma.category.findFirst({
      where: { slug: 'electronica' }
    });

    // Si no existe, crearla
    if (!category) {
      category = await prisma.category.create({
        data: { name: 'Electrónica', slug: 'electronica' }
      });
    }

    // Crear productos variados
    const products = await prisma.product.createMany({
      data: [
        {
          name: 'Laptop Gaming Pro',
          slug: 'laptop-gaming-pro',
          description: 'Laptop potente para programar',
          price: 15999.99,
          compareAtPrice: 18999.99,
          stock: 10,
          categoryId: category.id,
          images: ['https://via.placeholder.com/400'],
        },
        {
          name: 'Monitor 4K',
          slug: 'monitor-4k',
          description: 'Monitor ultra HD',
          price: 8999.99,
          compareAtPrice: 10999.99,
          stock: 20,
          categoryId: category.id,
          images: ['https://via.placeholder.com/400'],
        },
        {
          name: 'Teclado Mecánico',
          slug: 'teclado-mecanico',
          description: 'Teclado RGB',
          price: 3999.99,
          compareAtPrice: 4999.99,
          stock: 30,
          categoryId: category.id,
          images: ['https://via.placeholder.com/400'],
        },
      ],
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      message: `${products.count} productos creados`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}