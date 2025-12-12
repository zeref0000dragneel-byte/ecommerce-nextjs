"use client";

import Header from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const router = useRouter();

  // Cálculos
  const total = totalPrice;
  const shippingCost = total >= 500 ? 0 : 99;
  const finalTotal = total + shippingCost;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-gray-600 mb-8">
              Explora nuestra tienda y encuentra productos increíbles
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <span>Ir a la tienda</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Carrito de compras
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.variantId || 'base'}`} // ✅ Key única para variantes
                className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-4"
              >
                {/* Imagen */}
                <div className="relative w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingBag className="w-12 h-12" />
                    </div>
                  )}
                </div>

                {/* Información */}
                <div className="flex-1">
                  <Link
                    href={`/shop/${item.slug}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition"
                  >
                    {item.name}
                  </Link>
                  
                  {/* ✅ NUEVO: Mostrar variante */}
                  {item.variantDetails && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Variante:</span> {item.variantDetails}
                    </p>
                  )}

                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    ${item.price.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </p>

                  {/* Controles de cantidad */}
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantId)} // ✅ Pasar variantId
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)} // ✅ Pasar variantId
                        disabled={item.quantity >= item.stock}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id, item.variantId)} // ✅ Pasar variantId
                      className="text-red-600 hover:text-red-800 transition flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Eliminar</span>
                    </button>
                  </div>

                  {/* Stock disponible */}
                  {item.stock <= 5 && (
                    <p className="text-sm text-yellow-600 mt-2">
                      ⚠️ Solo quedan {item.stock} unidades
                    </p>
                  )}

                  {/* Subtotal */}
                  <p className="text-gray-600 mt-4">
                    Subtotal:{" "}
                    <span className="font-bold text-gray-900">
                      ${(item.price * item.quantity).toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </p>
                </div>
              </div>
            ))}

            {/* Botón limpiar carrito */}
            <button
              onClick={clearCart}
              className="w-full text-red-600 hover:text-red-800 transition py-3 border border-red-300 rounded-lg hover:bg-red-50"
            >
              Vaciar carrito
            </button>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Resumen del pedido
              </h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal (
                    {items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                    productos)
                  </span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span
                    className={`font-medium ${
                      shippingCost === 0 ? "text-green-600" : ""
                    }`}
                  >
                    {shippingCost === 0
                      ? "GRATIS"
                      : `$${shippingCost.toFixed(2)}`}
                    </span>
                </div>

                {total > 0 && total < 500 && (
                  <p className="text-sm text-gray-500">
                    Añade ${(500 - total).toFixed(2)} más para envío gratis
                  </p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-blue-600">${finalTotal.toFixed(2)} MXN</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
              >
                Proceder al pago
              </button>

              <button
                onClick={() => router.push("/shop")}
                className="w-full mt-3 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Continuar comprando
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}