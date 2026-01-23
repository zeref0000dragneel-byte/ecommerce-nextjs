import { prisma } from "@/app/lib/prisma";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Search, Package } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Explora nuestro catálogo completo de productos. Filtra por categoría y encuentra exactamente lo que buscas.",
};

export const revalidate = 300; // Revalidar cada 5 minutos

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  // Await searchParams (Next.js 15)
  const params = await searchParams;
  
  // Obtener categorías
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // Construir query de productos (solo productos activos)
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
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Mapear images[0] a imageUrl para compatibilidad con componentes existentes
  const productsWithImageUrl = products.map((product) => ({
    ...product,
    imageUrl: product.images && product.images.length > 0 ? product.images[0] : null,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-primary rounded-3xl p-8 md:p-12 mb-10 text-white shadow-2xl">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Nuestra Tienda
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Tu destino para productos de alta gama. Miles de opciones para elegir.
            </p>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-6 md:p-8 mb-8 border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <form className="flex-1" action="/shop" method="get">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="search"
                  placeholder="Buscar productos..."
                  defaultValue={params.search}
                  className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-lg focus:ring-2 focus:ring-action focus:border-action transition-all text-primary placeholder-gray-400"
                />
              </div>
            </form>

            {/* Filtro de categoría */}
            <CategoryFilter
              categories={categories}
              currentCategory={params.category}
            />
          </div>

          {/* Filtros activos */}
          {(params.category || params.search) && (
            <div className="mt-6 flex flex-wrap items-center gap-3 pt-6 border-t border-border">
              <span className="text-sm font-semibold text-primary">Filtros activos:</span>
              {params.search && (
                <span className="bg-action text-white px-4 py-2 rounded-full text-sm font-medium shadow-md flex items-center gap-2">
                  🔍 {params.search}
                </span>
              )}
              {params.category && (
                <span className="bg-action text-white px-4 py-2 rounded-full text-sm font-medium shadow-md flex items-center gap-2">
                  📦 {categories.find((c) => c.id === params.category)?.name}
                </span>
              )}
              <a
                href="/shop"
                className="text-sm text-action hover:text-action/80 font-semibold underline transition"
              >
                ✕ Limpiar filtros
              </a>
            </div>
          )}
        </div>

        {/* Contador de productos */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-action p-2 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <p className="text-primary font-semibold">
              Mostrando <span className="text-primary text-xl font-bold">{productsWithImageUrl.length}</span>{" "}
              {productsWithImageUrl.length === 1 ? "producto" : "productos"}
            </p>
          </div>
        </div>

        {/* Grid de productos */}
        {productsWithImageUrl.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8" style={{ gap: 'var(--spacing-md)' }}>
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
                  stock={product.stock}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-border">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-primary mb-3">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              No hay productos que coincidan con los filtros seleccionados. Intenta con otros criterios de búsqueda.
            </p>
            <a
              href="/shop"
              className="inline-flex items-center bg-cta text-white px-8 py-3 rounded-lg font-semibold hover:bg-cta/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Ver todos los productos
            </a>
          </div>
        )}
      </main>
    </div>
  );
}