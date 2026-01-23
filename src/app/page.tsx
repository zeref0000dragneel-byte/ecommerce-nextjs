export const dynamic = 'force-dynamic';

import { prisma } from "@/app/lib/prisma";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, Truck, Shield, Store } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio",
  description: "Bienvenido a nuestra tienda. Descubre los mejores productos de electrónica al mejor precio. Envío gratis en compras mayores a $500.",
};

export const revalidate = 60; // Revalidar cada 60 segundos

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    take: 8,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      images: true,
      stock: true,
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

      {/* Hero Section - Premium 2 Column Layout */}
      <section className="relative overflow-hidden bg-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Columna Izquierda - Contenido */}
            <div className="animate-fadeIn">
              <div className="inline-block mb-6 px-4 py-2 bg-action/10 rounded-full">
                <span className="text-action font-semibold text-sm">✨ Bienvenido a la mejor experiencia</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-primary">
                Descubre Productos
                <span className="block text-action">
                  Extraordinarios
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-xl">
                Tu destino para productos de alta gama con la mejor calidad y servicio excepcional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/shop"
                  className="group inline-flex items-center justify-center bg-cta text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-cta/90 transition-all duration-500 shadow-[0_8px_24px_rgba(231,111,81,0.35)] hover:shadow-[0_12px_32px_rgba(231,111,81,0.45)] transform hover:-translate-y-1"
                >
                  <span>Explorar Productos</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-500" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center bg-white text-primary border-2 border-primary px-10 py-5 rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition-all duration-500"
                >
                  Ver Ofertas
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-2 text-gray-500">
                <span className="text-sm font-medium">✨ Envío gratis en compras mayores a $500</span>
              </div>
            </div>

            {/* Columna Derecha - Imagen con Efecto Flotación */}
            <div className="relative animate-fadeIn">
              <div className="relative rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(38,70,83,0.15)] animate-[float_6s_ease-in-out_infinite]">
                {productsWithImageUrl.length > 0 && productsWithImageUrl[0].imageUrl ? (
                  <div className="aspect-[4/5] relative">
                    <Image
                      src={productsWithImageUrl[0].imageUrl}
                      alt={productsWithImageUrl[0].name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/5] bg-gradient-to-br from-primary/10 via-action/10 to-cta/10 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Package className="w-32 h-32 text-primary/20 mx-auto mb-4" />
                      <p className="text-gray-400 text-sm">Imagen del producto destacado</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Efecto de brillo decorativo */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-action/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-cta/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-[12px] bg-white border border-border shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-500 hover-lift">
              <div className="bg-action w-20 h-20 rounded-[12px] flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-all duration-500 shadow-lg">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Envío Gratis</h3>
              <p className="text-gray-600 leading-relaxed">
                En compras mayores a $500. Llevamos tus productos hasta la puerta de tu casa.
              </p>
            </div>
            <div className="group text-center p-8 rounded-[12px] bg-white border border-border shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-500 hover-lift">
              <div className="bg-action w-20 h-20 rounded-[12px] flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-all duration-500 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Compra Segura</h3>
              <p className="text-gray-600 leading-relaxed">
                Tus datos están protegidos con encriptación de nivel bancario. Compra con confianza.
              </p>
            </div>
            <div className="group text-center p-8 rounded-[12px] bg-white border border-border shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-500 hover-lift">
              <div className="bg-action w-20 h-20 rounded-[12px] flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-all duration-500 shadow-lg">
                <Package className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Entrega Rápida</h3>
              <p className="text-gray-600 leading-relaxed">
                3-5 días hábiles. Recibe tus productos en tiempo récord con nuestro servicio express.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fadeIn">
            <div className="inline-block mb-4 px-4 py-2 bg-action/10 rounded-full">
              <span className="text-action font-semibold text-sm">✨ Productos Destacados</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Lo Mejor de Nuestra
              <span className="block text-primary">
                Colección
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Descubre nuestros productos más populares y mejor valorados por nuestros clientes
            </p>
          </div>

          {productsWithImageUrl.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {productsWithImageUrl.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
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
            <div className="text-center py-16">
              <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay productos disponibles en este momento</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center bg-cta text-white px-8 py-4 rounded-lg font-semibold hover:bg-cta/90 transition-all duration-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>Ver Todos los Productos</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-[#F8F9FA] overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-primary">
            ¿Listo para Comprar?
          </h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Explora nuestra colección completa de productos y encuentra exactamente lo que buscas
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center bg-cta text-white px-10 py-5 rounded-xl font-bold hover:bg-cta/90 transition-all duration-500 shadow-[0_8px_24px_rgba(231,111,81,0.35)] hover:shadow-[0_12px_32px_rgba(231,111,81,0.45)] transform hover:-translate-y-1 text-lg"
          >
            <span>Ir a la Tienda</span>
            <ArrowRight className="ml-3 w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-action p-2 rounded-lg">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Mi Tienda</span>
              </div>
              <p className="text-white/70 text-sm">
                Tu destino para productos de alta gama.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link href="/" className="hover:text-white transition">Inicio</Link></li>
                <li><Link href="/shop" className="hover:text-white transition">Productos</Link></li>
                <li><Link href="/cart" className="hover:text-white transition">Carrito</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>📧 contacto@mitienda.com</li>
                <li>📱 +52 55 1234 5678</li>
                <li>📍 Ciudad de México, México</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/70 text-sm">
              © 2024 Mi Tienda. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}