"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id, name, slug, price, imageUrl, stock });
  };

  return (
    <Link href={`/shop/${slug}`} className="group">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Imagen */}
        <div className="relative aspect-square bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingCart className="w-16 h-16" />
            </div>
          )}
          
          {/* Badge de stock */}
          {stock === 0 ? (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Agotado
            </div>
          ) : stock <= 5 ? (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Últimas {stock}
            </div>
          ) : null}
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
            {name}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">
              ${price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </span>
            
            {stock > 0 && (
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                title="Agregar al carrito"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            )}
          </div>

          {stock > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {stock} disponibles
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}