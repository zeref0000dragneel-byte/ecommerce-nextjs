"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  stock: number | null;
  isPreOrder?: boolean;
  preOrderDays?: string | null;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  imageUrl,
  stock,
  isPreOrder = false,
  preOrderDays = null,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const isAvailable = isPreOrder || (stock ?? 0) > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem({
      id,
      name,
      slug,
      price,
      imageUrl,
      stock: isPreOrder ? 999 : (stock ?? 0),
      isPreOrder,
      preOrderDays,
    });
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleWhatsAppRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const preOrderText = isPreOrder ? ` (⚠️ Sobre pedido: ${preOrderDays || "consultar"})` : "";
    const message =
      `Hola, me interesa el producto: *${name}*${preOrderText}\n\n` +
      `Precio: $${price.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN\n` +
      "¿Está disponible?";
    window.open(`https://wa.me/5219516111552?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div
      className="group relative bg-white rounded-[20px] border-2 border-gray-100 shadow-soft hover:shadow-hover transition-all duration-500 overflow-hidden hover:-translate-y-2 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-bg-light to-gray-100">
        <Link href={`/shop/${slug}`} className="block w-full h-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className={`object-cover transition-transform duration-700 ease-out ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ShoppingCart className="w-12 h-12" />
            </div>
          )}
        </Link>

        <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
          {isPreOrder ? (
            <span className="bg-orange-500/90 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
              Sobre pedido
            </span>
          ) : (stock ?? 0) === 0 ? (
            <span className="bg-accent-soft text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
              Agotado
            </span>
          ) : (stock ?? 0) <= 5 ? (
            <span className="bg-warning text-secondary-dark px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
              Últimas {(stock ?? 0)}
            </span>
          ) : null}
        </div>

        <div className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-center justify-center transition-opacity duration-300 pointer-events-none ${isHovered ? "opacity-100" : "opacity-0"}`}>
          <Link
            href={`/shop/${slug}`}
            className="bg-white text-secondary-dark p-3 rounded-full shadow-xl hover:bg-primary hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 pointer-events-auto"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-2">
          <Link href={`/shop/${slug}`}>
            <h2 className="font-display text-lg font-bold text-secondary-dark leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors duration-300">
              {name}
            </h2>
          </Link>
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-title text-secondary-dark tracking-tight">
              ${price.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] font-bold text-gray-400">MXN</span>
          </div>
          {isPreOrder ? (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="text-[11px] font-medium text-orange-600">
                Sobre pedido{preOrderDays ? ` (${preOrderDays})` : ''}
              </span>
            </div>
          ) : (stock ?? 0) > 0 ? (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 bg-[#2A9D8F] rounded-full animate-pulse" />
              <span className="text-[11px] text-gray-500 font-medium">{(stock ?? 0)} disponibles</span>
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2">
          <button
            onClick={handleWhatsAppRedirect}
            className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 bg-whatsapp text-white hover:bg-[#128C7E] shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:scale-105 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>Hazlo Tuyo</span>
          </button>

          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || isAdding}
            className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
              isAdding
                ? "bg-action text-white"
                : "bg-gradient-to-r from-coral to-primary text-white hover:from-primary hover:to-coral active:scale-95 shadow-[0_4px_14px_rgba(255,87,34,0.4)]"
            } disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed`}
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Agregando...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>{!isAvailable ? "Agotado" : "Agregar"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
}