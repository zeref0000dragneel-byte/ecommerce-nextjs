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

  const total = totalPrice;

  const handleWhatsAppClick = () => {
    const phoneNumber = "5219516111552";
    let messageText = "¡Hola! Me interesan estos productos de mi carrito:\n\n";

    items.forEach((item) => {
      const variantText = item.variantDetails ? ` (${item.variantDetails})` : "";
      const preOrderText = item.isPreOrder
        ? ` (⚠️ Sobre pedido: ${item.preOrderDays || "consultar"})`
        : "";
      messageText += `📦 *${item.name}*${variantText}${preOrderText}\n`;
      messageText += `   Cant: ${item.quantity} | $${(item.price * item.quantity).toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN\n\n`;
    });

    messageText += `💰 *Total:* $${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN\n\n`;
    messageText += "¿Están disponibles?";

    const encodedMessage = encodeURIComponent(messageText);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF9F7] via-white to-bg-light">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-md mx-auto">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary rounded-full blur-2xl opacity-30" />
              <div className="relative bg-gradient-to-br from-primary to-coral p-6 rounded-2xl shadow-glow">
                <ShoppingBag className="w-20 h-20 text-white" />
              </div>
            </div>
            <h1 className="font-title text-4xl font-bold text-secondary-dark mb-4 tracking-wider">Tu carrito está vacío</h1>
            <p className="text-gray-600 mb-8">Llénalo con estilo ONSET</p>
            <Link
              href="/shop"
              className="inline-flex items-center bg-gradient-to-r from-primary to-coral text-white px-10 py-4 rounded-xl font-bold shadow-glow hover:shadow-hover transition-all duration-300 transform hover:scale-105 active:scale-95"
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
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F7] via-white to-bg-light">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h1 className="font-title text-4xl md:text-5xl font-bold text-secondary-dark mb-2 tracking-wider">Carrito</h1>
          <p className="text-gray-600 text-lg font-medium">
            {items.reduce((acc, item) => acc + item.quantity, 0)} productos en tu carrito
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.id}-${item.variantId || 'base'}`}
                className="bg-white rounded-2xl shadow-soft p-6 flex flex-col sm:flex-row gap-6 border-2 border-gray-100 animate-fadeIn hover:shadow-hover transition-shadow duration-300"
              >
                <Link href={`/shop/${item.slug}`} className="relative w-full sm:w-40 h-40 bg-gradient-to-br from-bg-light to-gray-100 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-100">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="160px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingBag className="w-16 h-16" />
                    </div>
                  )}
                </Link>

                <div className="flex-1">
                  <h2 className="font-display text-xl font-bold text-secondary-dark mb-2">{item.name}</h2>
                  {item.variantDetails && (
                    <span className="bg-action/20 text-action-dark px-3 py-1 rounded-full text-sm font-bold mb-3 inline-block">
                      {item.variantDetails}
                    </span>
                  )}
                  <div className="mb-4">
                    <p className="text-3xl font-title text-primary">${item.price.toLocaleString("es-MX")}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantId)} disabled={item.quantity <= 1} className="p-3 hover:bg-gray-100 disabled:opacity-50 transition-colors"><Minus className="w-5 h-5" /></button>
                      <span className="px-6 py-3 font-bold text-lg min-w-[60px] text-center text-secondary-dark">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)} disabled={item.quantity >= item.stock} className="p-3 hover:bg-gray-100 disabled:opacity-50 transition-colors"><Plus className="w-5 h-5" /></button>
                    </div>
                    <button onClick={() => removeItem(item.id, item.variantId)} className="text-accent-soft p-3 rounded-xl hover:bg-accent-soft/10 transition-colors font-bold"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={clearCart} className="w-full text-accent-soft py-4 border-2 border-accent-soft/40 rounded-xl hover:bg-accent-soft/10 font-bold transition-all duration-300">
              Vaciar carrito
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-hover p-6 md:p-8 sticky top-24 border-2 border-gray-100">
              <h2 className="font-display text-2xl font-bold text-secondary-dark mb-6 flex items-center gap-2">
                Resumen del Pedido
              </h2>

              <div className="bg-gradient-to-r from-action/15 to-primary/10 rounded-xl p-4 mb-6 border-2 border-action/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-secondary-dark">Total</span>
                  <span className="text-3xl font-title text-primary">
                    ${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-medium">MXN (IVA incluido)</p>
              </div>

              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-whatsapp hover:bg-[#128C7E] text-white py-4 rounded-xl transition-all duration-300 font-bold shadow-float hover:scale-105 active:scale-95 mb-3 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contactar por WhatsApp
              </button>

              <button
                onClick={() => router.push("/shop")}
                className="w-full bg-gray-100 text-secondary-dark py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-bold border-2 border-gray-200"
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
