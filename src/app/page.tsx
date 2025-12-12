import { PrismaClient } from "@prisma/client";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight, Package, Truck, Shield } from "lucide-react";

const prisma = new PrismaClient();

export default async function Home() {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Bienvenido a Mi Tienda
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Los mejores productos de electrónica al mejor precio. Envío gratis en compras mayores a $500
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <span>Ver todos los productos</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Envío gratis</h3>
              <p className="text-gray-600">
                En compras mayores a $500
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Compra segura</h3>
              <p className="text-gray-600">
                Tus datos están protegidos
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Entrega rápida</h3>
              <p className="text-gray-600">
                3-5 días hábiles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Productos destacados
              </h2>
              <p className="text-gray-600 mt-2">
                Lo último en tecnología
              </p>
            </div>
            <Link
              href="/shop"
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
            >
              <span>Ver todos</span>
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

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
              <p className="text-gray-500">No hay productos disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para comprar?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Explora nuestra colección completa de productos
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            <span>Ir a la tienda</span>
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Mi Tienda. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}