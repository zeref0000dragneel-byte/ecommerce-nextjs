export const dynamic = 'force-dynamic';

import { prisma } from "@/app/lib/prisma";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, Truck, Shield, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio",
  description: "ONSET – Tu estilo, tu inicio. Descubre productos con energía. Envío rápido y seguro.",
};

export const revalidate = 60;

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

  const productsWithImageUrl = products.map((product) => ({
    ...product,
    imageUrl: product.images && product.images.length > 0 ? product.images[0] : null,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F7] via-white to-[#F0FDFA]">
      <Header />

      {/* Hero – Agresivo, juvenil */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary-dark via-[#1e3a47] to-action/90">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,87,34,0.2)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(0,180,216,0.15)_0%,transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fadeIn">
              <div className="inline-block mb-6 px-4 py-2 bg-primary/20 rounded-full border border-primary/30">
                <span className="text-primary font-bold text-sm uppercase tracking-wider">Energía · Inicio · Impacto</span>
              </div>
              <h1 className="font-title text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight text-white tracking-wider" style={{ letterSpacing: '0.02em' }}>
                TU ESTILO
                <span className="block bg-gradient-to-r from-primary via-coral to-secondary-salmon bg-clip-text text-transparent">
                  TU INICIO
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-xl">
                ONSET es donde empieza todo. Productos con actitud, envío rápido y precios que vibran.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/shop"
                  className="group inline-flex items-center justify-center bg-gradient-to-r from-primary to-coral text-white px-10 py-5 rounded-xl font-bold text-lg shadow-glow hover:shadow-hover transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  <span>Explorar Productos</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center bg-white/10 backdrop-blur text-white border-2 border-white/40 px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  Ver Ofertas
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-2 text-white/80 text-sm font-medium">
                <span>Envío gratis en compras +$500</span>
              </div>
            </div>

            <div className="relative animate-fadeIn">
              <div className="relative rounded-[24px] overflow-hidden shadow-2xl border-2 border-white/10 animate-float">
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
                  <div className="aspect-[4/5] bg-gradient-to-br from-primary/20 via-action/20 to-accent-electric/20 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Package className="w-32 h-32 text-white/30 mx-auto mb-4" />
                      <p className="text-white/50 text-sm">Producto destacado</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/30 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-accent-electric/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-b from-white to-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-2xl bg-white border-2 border-gray-100 shadow-soft hover:shadow-hover hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-primary to-coral w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-glow">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3 text-secondary-dark">Envío Gratis</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                En compras +$500. Llevamos tu pedido hasta tu puerta.
              </p>
            </div>
            <div className="group text-center p-8 rounded-2xl bg-white border-2 border-gray-100 shadow-soft hover:shadow-hover hover:border-action/30 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-action to-accent-electric w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-float">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3 text-secondary-dark">Compra Segura</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Datos protegidos. Compra con confianza.
              </p>
            </div>
            <div className="group text-center p-8 rounded-2xl bg-white border-2 border-gray-100 shadow-soft hover:shadow-hover hover:border-secondary-salmon/30 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-secondary-salmon to-coral w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Package className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3 text-secondary-dark">Entrega Rápida</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                3-5 días hábiles. Express disponible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fadeIn">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-primary font-bold text-sm uppercase tracking-wider">Lo nuevo</span>
            </div>
            <h2 className="font-title text-4xl md:text-5xl text-secondary-dark mb-4 tracking-wider" style={{ letterSpacing: '0.02em' }}>
              LO MEJOR DE
              <span className="block text-gradient-onset">ONSET</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Productos con actitud. Elige el tuyo.
            </p>
          </div>

          {productsWithImageUrl.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {productsWithImageUrl.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 80}ms` }}
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
              <p className="text-gray-500 text-lg">No hay productos disponibles aún</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center bg-gradient-to-r from-primary to-coral text-white px-8 py-4 rounded-xl font-bold shadow-glow hover:shadow-hover transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <span>Ver Todos los Productos</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 bg-gradient-to-br from-secondary-dark via-[#1e3a47] to-action overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,87,34,0.15)_0%,transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-title text-4xl md:text-5xl text-white mb-6 tracking-wider">
            ¿LISTO PARA EMPEZAR?
          </h2>
          <p className="text-lg text-white/90 mb-10 leading-relaxed">
            Explora la colección ONSET y encuentra tu estilo.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center bg-gradient-to-r from-primary to-coral text-white px-10 py-5 rounded-xl font-bold shadow-glow hover:shadow-hover transition-all duration-300 transform hover:scale-105 text-lg"
          >
            <span>Ir a la Tienda</span>
            <ArrowRight className="ml-3 w-6 h-6" />
          </Link>
        </div>
      </section>

    </div>
  );
}
