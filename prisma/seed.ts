import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log('✅ Datos anteriores eliminados');

  // Crear categorías
  const electronica = await prisma.category.create({
    data: {
      name: 'Electrónica',
      slug: 'electronica',
    },
  });

  const belleza = await prisma.category.create({
    data: {
      name: 'Belleza y Cuidado Personal',
      slug: 'belleza-y-cuidado-personal',
    },
  });

  const hogar = await prisma.category.create({
    data: {
      name: 'Hogar',
      slug: 'hogar',
    },
  });

  const tecnologia = await prisma.category.create({
    data: {
      name: 'Tecnología',
      slug: 'tecnologia',
    },
  });

  console.log('✅ Categorías creadas');

  // Crear productos con images (array) y compareAtPrice
  await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'El iPhone más avanzado con chip A17 Pro y cámara de 48MP',
      price: 25999.0,
      compareAtPrice: 28999.0,
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop',
      ],
      stock: 10,
      categoryId: electronica.id,
      isActive: true,
    },
  });

  await prisma.product.create({
    data: {
      name: 'MacBook Air M2',
      slug: 'macbook-air-m2',
      description: 'Laptop ultradelgada con chip M2 y pantalla Retina de 13 pulgadas',
      price: 32999.0,
      compareAtPrice: 35999.0,
      images: [
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
      ],
      stock: 5,
      categoryId: tecnologia.id,
      isActive: true,
    },
  });

  await prisma.product.create({
    data: {
      name: 'AirPods Pro',
      slug: 'airpods-pro',
      description: 'Audífonos inalámbricos con cancelación activa de ruido',
      price: 5999.0,
      compareAtPrice: 6999.0,
      images: [
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800&h=800&fit=crop',
      ],
      stock: 20,
      categoryId: electronica.id,
      isActive: true,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Crema Facial Hidratante Premium',
      slug: 'crema-facial-hidratante-premium',
      description: 'Hidratación profunda para todo tipo de piel con ingredientes naturales',
      price: 299.99,
      compareAtPrice: 399.99,
      images: [
        'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop',
      ],
      stock: 50,
      categoryId: belleza.id,
      isActive: true,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Audífonos Bluetooth Premium',
      slug: 'audifonos-bluetooth-premium',
      description: 'Audífonos inalámbricos con excelente calidad de sonido y cancelación de ruido',
      price: 200.0,
      compareAtPrice: 299.99,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop',
      ],
      stock: 30,
      categoryId: electronica.id,
      isActive: true,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Laptop HP Pavilion',
      slug: 'laptop-hp-pavilion',
      description: 'Laptop potente para trabajo y estudio con procesador Intel Core i7',
      price: 15999.99,
      compareAtPrice: 18999.99,
      images: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop',
      ],
      stock: 8,
      categoryId: tecnologia.id,
      isActive: true,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Aspiradora Robot Inteligente',
      slug: 'aspiradora-robot-inteligente',
      description: 'Limpieza automática inteligente para tu hogar con mapeo avanzado',
      price: 4999.0,
      compareAtPrice: 5999.0,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop',
      ],
      stock: 12,
      categoryId: hogar.id,
      isActive: true,
    },
  });

  console.log('✅ Productos creados');
  console.log('🎉 Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });