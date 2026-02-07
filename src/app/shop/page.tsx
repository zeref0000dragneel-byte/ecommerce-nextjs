import { prisma } from "@/app/lib/prisma";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Search, Package } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Explora el catálogo ONSET. Filtra por categoría y encuentra tu estilo.",
};

export const revalidate = 300;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const where: any = {
    isActive: true,
  };

  if (params.category) {
    where.categoryId = params.category;
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      images: true,
      stock: true,
      isPreOrder: true,
      preOrderDays: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const productsWithImageUrl = products.map((product) => ({
    ...product,
    imageUrl: product.images && product.images.length > 0 ? product.images[0] : null,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F7] via-white to-bg-light">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Tienda */}
        <div className="relative overflow-hidden bg-gradient-to-r from-secondary-dark via-[#1e3a47] to-action rounded-3xl p-8 md:p-12 mb-10 text-white shadow-2xl border border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(255,87,34,0.2)_0%,transparent_50%)]" />
          <div className="relative z-10">
            <h1 className="font-title text-4xl md:text-5xl tracking-wider mb-4 text-white">
              TIENDA ONSET
            </h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Todo el catálogo con actitud. Filtra y encuentra lo que buscas.
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8 mb-8 border-2 border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <form className="flex-1" action="/shop" method="get">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="search"
                  placeholder="Buscar productos..."
                  defaultValue={params.search}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-secondary-dark placeholder-gray-400 font-medium"
                />
              </div>
            </form>
            <CategoryFilter
              categories={categories}
              currentCategory={params.category}
            />
          </div>

          {(params.category || params.search) && (
            <div className="mt-6 flex flex-wrap items-center gap-3 pt-6 border-t border-gray-200">
              <span className="text-sm font-bold text-secondary-dark">Filtros:</span>
              {params.search && (
                <span className="bg-gradient-to-r from-primary to-coral text-white px-4 py-2 rounded-full text-sm font-bold shadow-soft">
                  {params.search}
                </span>
              )}
              {params.category && (
                <span className="bg-action text-white px-4 py-2 rounded-full text-sm font-bold shadow-soft">
                  {categories.find((c) => c.id === params.category)?.name}
                </span>
              )}
              <a
                href="/shop"
                className="text-sm text-primary hover:text-primary-dark font-bold underline transition"
              >
                Limpiar filtros
              </a>
            </div>
          )}
        </div>

        {/* Contador */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-coral p-2 rounded-xl">
              <Package className="w-5 h-5 text-white" />
            </div>
            <p className="text-secondary-dark font-bold">
              Mostrando <span className="text-primary text-xl font-title">{productsWithImageUrl.length}</span>{" "}
              {productsWithImageUrl.length === 1 ? "producto" : "productos"}
            </p>
          </div>
        </div>

        {/* Grid */}
        {productsWithImageUrl.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {productsWithImageUrl.map((product, index) => (
              <div
                key={product.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  stock={product.stock ?? 0}
                  isPreOrder={product.isPreOrder}
                  preOrderDays={product.preOrderDays}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-soft border-2 border-gray-100">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="font-display text-2xl font-bold text-secondary-dark mb-3">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Prueba con otros filtros o búsqueda.
            </p>
            <a
              href="/shop"
              className="inline-flex items-center bg-gradient-to-r from-primary to-coral text-white px-8 py-3 rounded-xl font-bold shadow-glow hover:shadow-hover transition-all duration-300 transform hover:scale-105"
            >
              Ver todos
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
