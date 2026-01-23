"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  stock: number;
}

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem(product, quantity);
    router.push("/cart");
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Selector de cantidad */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-medium">Cantidad:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-6 py-2 font-semibold">{quantity}</span>
          <button
            onClick={incrementQuantity}
            disabled={quantity >= product.stock}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Botón agregar al carrito */}
      <button
        onClick={handleAddToCart}
        className="w-full bg-cta text-white py-4 px-6 rounded-lg font-semibold hover:bg-cta/90 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
      >
        <ShoppingCart className="w-5 h-5" />
        <span>Agregar al carrito</span>
      </button>

      {/* Total parcial */}
      <div className="text-center text-gray-600">
        <span className="text-sm">Subtotal: </span>
        <span className="text-lg font-bold text-gray-900">
          ${(product.price * quantity).toLocaleString("es-MX", {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  );
}