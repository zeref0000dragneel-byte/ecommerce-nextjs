import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductDetailClient from "./ProductDetailClient";

const prisma = new PrismaClient();

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: {
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/shop"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver a la tienda
          </Link>
        </div>

        {/* Componente cliente con lógica de variantes */}
        <ProductDetailClient product={product} />
      </main>
    </div>
  );
}