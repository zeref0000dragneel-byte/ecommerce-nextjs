import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
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

  // Crear productos
  await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'El iPhone más avanzado con chip A17 Pro y cámara de 48MP',
      price: 25999.0,
      comparePrice: 28999.0,
      stock: 10,
      categoryId: electronica.id,
      imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_641675-MLU69557720768_052023-F.webp',
      isActive: true,
    },
  });

  await prisma.product.create({
    data: {
      name: 'MacBook Air M2',
      slug: 'macbook-air-m2',
      description: 'Laptop ultradelgada con chip M2 y pantalla Retina de 13 pulgadas',
      price: 32999.0,
      stock: 5,
      categoryId: tecnologia.id,
      imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_954426-MLA51356381077_082022-F.webp',
      isActive: true,
    },
  });

  await prisma.product.create({
    data: {
      name: 'AirPods Pro',
      slug: 'airpods-pro',
      description: 'Audífonos inalámbricos con cancelación activa de ruido',
      price: 5999.0,
      stock: 20,
      categoryId: electronica.id,
      imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_610714-MLU69568896436_052023-F.webp',
      isActive: true,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Crema Facial Hidratante',
      slug: 'crema-facial-hidratante',
      description: 'Hidratación profunda para todo tipo de piel',
      price: 299.99,
      stock: 50,
      categoryId: belleza.id,
      imageUrl: 'https://via.placeholder.com/400x400?text=Crema+Facial',
      isActive: true,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Audífonos Bluetooth YD30',
      slug: 'audifonos-bluetooth-yd30',
      description: 'Audífonos inalámbricos con excelente calidad de sonido',
      price: 200.0,
      stock: 30,
      categoryId: electronica.id,
      imageUrl: 'https://via.placeholder.com/400x400?text=Audifonos',
      isActive: true,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Laptop HP Pavilion',
      slug: 'laptop-hp-pavilion',
      description: 'Laptop potente para trabajo y estudio',
      price: 15999.99,
      stock: 8,
      categoryId: tecnologia.id,
      imageUrl: 'https://via.placeholder.com/400x400?text=Laptop+HP',
      isActive: true,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Aspiradora Robot',
      slug: 'aspiradora-robot',
      description: 'Limpieza automática inteligente para tu hogar',
      price: 4999.0,
      stock: 12,
      categoryId: hogar.id,
      imageUrl: 'https://via.placeholder.com/400x400?text=Aspiradora',
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