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
  stock: number;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  imageUrl,
  stock,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem({ id, name, slug, price, imageUrl, stock });
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div
      className="group relative bg-white rounded-[16px] border border-[#E9ECEF] shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenedor de Imagen con Relación de Aspecto Premium */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F9FA]">
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
        
        {/* Badges de Disponibilidad */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
          {stock === 0 ? (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Agotado
            </span>
          ) : stock <= 5 && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Últimas {stock}
            </span>
          )}
        </div>

        {/* Overlay de Acción Rápida */}
        <div className={`absolute inset-0 bg-black/5 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${isHovered ? "opacity-100" : "opacity-0"}`}>
             <Link
                href={`/shop/${slug}`}
                className="bg-white text-[#264653] p-3 rounded-full shadow-xl hover:bg-[#264653] hover:text-white transition-colors duration-300 transform translate-y-4 group-hover:translate-y-0 pointer-events-auto"
              >
                <Eye className="w-5 h-5" />
              </Link>
        </div>
      </div>

      {/* Información del Producto */}
      <div className="p-5">
        <div className="mb-1">
            <Link href={`/shop/${slug}`}>
              <h2 className="text-lg font-bold text-[#264653] leading-tight line-clamp-2 h-[3rem] group-hover:text-[#2A9D8F] transition-colors">
                {name}
              </h2>
            </Link>
        </div>

        {/* Precio y Indicador de Stock Realista */}
        <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#264653]">
                    ${price.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] font-bold text-gray-400">MXN</span>
            </div>
            {stock > 0 && (
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#2A9D8F] rounded-full animate-pulse"></span>
                    <span className="text-[11px] text-gray-500 font-medium">{stock} disponibles</span>
                </div>
            )}
        </div>

        {/* Botón CTA (Call To Action) - Ancho completo para evitar cortes de texto */}
        <div className="mt-5">
            <button
                onClick={handleAddToCart}
                disabled={stock === 0 || isAdding}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                    isAdding 
                    ? "bg-[#2A9D8F] text-white" 
                    : "bg-[#E76F51] text-white hover:bg-[#d66244] active:scale-[0.98] shadow-[0_4px_14px_rgba(231,111,81,0.4)]"
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
                        <span>{stock === 0 ? "Agotado" : "Agregar al carrito"}</span>
                    </>
                )}
            </button>
        </div>
      </div>

      {/* Efecto de Brillo Sutil al pasar el mouse */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    </div>
  );
}