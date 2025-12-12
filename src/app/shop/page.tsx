import { PrismaClient } from "@prisma/client";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Search } from "lucide-react";

const prisma = new PrismaClient();

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

  // Construir query de productos
  const where: any = {};
  
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
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Bienvenido a nuestra tienda</h1>
          <p className="text-blue-100 text-lg">
            Encuentra los mejores productos al mejor precio
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <form className="flex-1" action="/shop" method="get">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="search"
                  placeholder="Buscar productos..."
                  defaultValue={params.search}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Filtros activos:</span>
              {params.search && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Búsqueda: {params.search}
                </span>
              )}
              {params.category && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Categoría:{" "}
                  {categories.find((c) => c.id === params.category)?.name}
                </span>
              )}
              <a
                href="/shop"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Limpiar filtros
              </a>
            </div>
          )}
        </div>

        {/* Contador de productos */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando <span className="font-semibold">{products.length}</span>{" "}
            {products.length === 1 ? "producto" : "productos"}
          </p>
        </div>

        {/* Grid de productos */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                imageUrl={product.imageUrl}
                stock={product.stock}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron productos con los filtros seleccionados.
            </p>
            <a
              href="/shop"
              className="text-blue-600 hover:text-blue-800 underline mt-2 inline-block"
            >
              Ver todos los productos
            </a>
          </div>
        )}
      </main>
    </div>
  );
}