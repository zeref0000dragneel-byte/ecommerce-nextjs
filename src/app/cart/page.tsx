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

  // Ahora el total es directo, sin cálculos de envío
  const total = totalPrice;

  const handleWhatsAppClick = () => {
    const phoneNumber = "5219516111552";
    
    // Construcción del mensaje con saltos de línea reales (\n)
    let messageText = "¡Hola! Me interesan estos productos de mi carrito:\n\n";

    items.forEach((item) => {
      const variantText = item.variantDetails ? ` (${item.variantDetails})` : "";
      const priceStr = (item.price * item.quantity).toLocaleString("es-MX", { minimumFractionDigits: 2 });
      
      messageText += `📦 *${item.name}*${variantText}\n`;
      messageText += `   Cant: ${item.quantity} | $${priceStr}\n`;
    });

    messageText += `\n💰 *Total: $${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN*\n\n`;
    messageText += "¿Están disponibles?";

    // Usamos encodeURIComponent para que los emojis y negritas lleguen perfectos
    const encodedMessage = encodeURIComponent(messageText);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-md mx-auto">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-cta rounded-full blur-2xl opacity-30"></div>
              <div className="relative bg-cta p-6 rounded-full">
                <ShoppingBag className="w-20 h-20 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
            <Link
              href="/shop"
              className="inline-flex items-center bg-cta text-white px-10 py-4 rounded-lg font-semibold hover:bg-cta/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>Explorar Productos</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Carrito de Compras</h1>
          <p className="text-gray-600 text-lg">
            {items.reduce((acc, item) => acc + item.quantity, 0)} productos en tu carrito
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.id}-${item.variantId || 'base'}`}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row gap-6 border border-gray-100 animate-fadeIn"
              >
                {/* Imagen */}
                <Link href={`/shop/${item.slug}`} className="relative w-full sm:w-40 h-40 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="160px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingBag className="w-16 h-16" />
                    </div>
                  )}
                </Link>

                {/* Información */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h2>
                  {item.variantDetails && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-3 inline-block">
                      {item.variantDetails}
                    </span>
                  )}
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-primary">${item.price.toLocaleString("es-MX")}</p>
                  </div>

                  {/* Controles */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantId)} disabled={item.quantity <= 1} className="p-3 hover:bg-gray-100 disabled:opacity-50"><Minus className="w-5 h-5" /></button>
                      <span className="px-6 py-3 font-bold text-lg min-w-[60px] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)} disabled={item.quantity >= item.stock} className="p-3 hover:bg-gray-100 disabled:opacity-50"><Plus className="w-5 h-5" /></button>
                    </div>
                    <button onClick={() => removeItem(item.id, item.variantId)} className="text-red-600 p-3 rounded-lg hover:bg-red-50"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={clearCart} className="w-full text-red-600 py-4 border-2 border-red-300 rounded-xl hover:bg-red-50 font-semibold">
              🗑️ Vaciar carrito
            </button>
          </div>

          {/* Resumen Final */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 sticky top-24 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Resumen del Pedido
              </h2>

              <div className="bg-action/10 rounded-xl p-4 mb-6 border-2 border-action/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-primary">
                    ${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">MXN (IVA incluido)</p>
              </div>

              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-[#25D366] text-white py-4 rounded-lg hover:bg-[#20bd5a] transition-all duration-300 font-bold shadow-lg transform hover:-translate-y-0.5 mb-3 flex items-center justify-center gap-2"
              >
                Contactar por WhatsApp 📱
              </button>

              <button
                onClick={() => router.push("/shop")}
                className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
              >
                ← Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}