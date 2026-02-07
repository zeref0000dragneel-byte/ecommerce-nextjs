import { notFound } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import ProductDetailClient from './ProductDetailClient';
import Header from '@/components/Header';

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { 
      slug,
      isActive: true 
    },
    include: {
      category: true,
      variants: {
        where: { isActive: true },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!product) {
    notFound();
  }

  return product;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  // ✅ Transformar el producto para que tenga imageUrl en vez de images
  const transformedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    comparePrice: product.compareAtPrice, // ✅ Mapear compareAtPrice → comparePrice
    stock: product.stock ?? 0,
    isPreOrder: product.isPreOrder,
    preOrderDays: product.preOrderDays,
    imageUrl: product.images && product.images.length > 0 ? product.images[0] : null, // ✅ Convertir array → string
    category: {
      id: product.category.id,
      name: product.category.name,
    },
    variants: product.variants.map(variant => ({
      id: variant.id,
      color: variant.color,
      size: variant.size,
      sku: variant.sku,
      price: variant.price,
      stock: variant.stock,
      imageUrl: variant.imageUrl,
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F7] via-white to-bg-light">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetailClient product={transformedProduct} />
      </main>
    </div>
  );
}

// ✅ Generar metadata dinámica
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  try {
    const product = await getProduct(slug);
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;

    return {
      title: `${product.name} | ONSET`,
      description: product.description || `Compra ${product.name} en ONSET`,
      openGraph: imageUrl ? {
        images: [imageUrl],
      } : undefined,
    };
  } catch {
    return {
      title: 'Producto no encontrado | ONSET',
    };
  }
}