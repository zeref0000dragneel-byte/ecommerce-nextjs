'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, ShoppingCart, Check, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface Variant {
  id: string;
  color: string | null;
  size: string | null;
  sku: string | null;
  price: number | null;
  stock: number;
  imageUrl: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  stock: number;
  imageUrl: string | null;
  category: {
    id: string;
    name: string;
  };
  variants: Variant[];
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const hasVariants = product.variants && product.variants.length > 0;
  
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null); // ✅ Sin selección inicial
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Obtener colores y tallas únicas
  const colors = hasVariants
    ? Array.from(
        new Set(product.variants.filter((v) => v.color).map((v) => v.color))
      )
    : [];
  
  const sizes = hasVariants
    ? Array.from(
        new Set(product.variants.filter((v) => v.size).map((v) => v.size))
      )
    : [];

  // Precio, stock e imagen actuales
  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant?.stock || product.stock;
  const currentImage = selectedVariant?.imageUrl || product.imageUrl;

  // ✅ NUEVA FUNCIÓN: Toggle de variante (permite deseleccionar)
  const handleVariantClick = (variant: Variant) => {
    if (selectedVariant?.id === variant.id) {
      // Si ya está seleccionada, deseleccionar
      setSelectedVariant(null);
    } else {
      // Si no, seleccionar
      setSelectedVariant(variant);
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: currentPrice,
      imageUrl: currentImage,
      stock: currentStock,
      variantId: selectedVariant?.id,
      variantDetails: selectedVariant
        ? `${selectedVariant.color || ''}${selectedVariant.color && selectedVariant.size ? ' - ' : ''}${selectedVariant.size || ''}`.trim()
        : undefined,
    }, quantity);

    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8 p-8">
        {/* Imagen del producto */}
        <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
          {currentImage ? (
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Package className="w-32 h-32" />
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="flex flex-col">
          {/* Categoría */}
          <Link
            href={`/shop?category=${product.category.id}`}
            className="inline-block text-sm text-blue-600 hover:text-blue-800 mb-2"
          >
            {product.category.name}
          </Link>

          {/* Nombre */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          {/* Precio */}
          <div className="mb-6">
            <span className="text-4xl font-bold text-blue-600">
              ${currentPrice.toLocaleString("es-MX", {
                minimumFractionDigits: 2,
              })}
            </span>
            {product.comparePrice && (
              <span className="ml-3 text-xl text-gray-400 line-through">
                ${product.comparePrice.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                })}
              </span>
            )}
          </div>

          {/* Selector de Color (solo si hay variantes con color) */}
          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Color: {selectedVariant?.color || 'Original'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const variant = product.variants.find((v) => v.color === color);
                  const isSelected = selectedVariant?.color === color;
                  
                  return (
                    <button
                      key={color}
                      onClick={() => variant && handleVariantClick(variant)}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition flex items-center gap-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      {color}
                      {isSelected && <X className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
              {selectedVariant && (
                <p className="text-xs text-gray-500 mt-2">
                  Haz clic de nuevo para volver al original
                </p>
              )}
            </div>
          )}

          {/* Selector de Talla (solo si hay variantes con talla) */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Talla: {selectedVariant?.size || 'Original'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const variant = product.variants.find(
                    (v) =>
                      v.size === size &&
                      (!selectedVariant?.color || v.color === selectedVariant.color)
                  );
                  const isSelected = selectedVariant?.size === size;
                  
                  return (
                    <button
                      key={size}
                      onClick={() => variant && handleVariantClick(variant)}
                      disabled={!variant || variant.stock === 0}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition flex items-center gap-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : variant && variant.stock > 0
                          ? 'border-gray-300 hover:border-gray-400 text-gray-700'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {size}
                      {isSelected && <X className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
              {selectedVariant && (
                <p className="text-xs text-gray-500 mt-2">
                  Haz clic de nuevo para volver al original
                </p>
              )}
            </div>
          )}

          {/* Stock */}
          <div className="mb-6">
            {currentStock === 0 ? (
              <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-lg">
                <span className="font-semibold">Agotado</span>
              </div>
            ) : currentStock <= 5 ? (
              <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
                <span className="font-semibold">
                  ¡Solo quedan {currentStock} unidades!
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                <span className="font-semibold">
                  {currentStock} disponibles
                </span>
              </div>
            )}
          </div>

          {/* Descripción */}
          {product.description && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Descripción
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Cantidad y Agregar al carrito */}
          {currentStock > 0 && (
            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={currentStock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(currentStock, Math.max(1, parseInt(e.target.value) || 1))
                    )
                  }
                  className="w-16 text-center border-x border-gray-300 py-2 text-gray-900"
                />
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
              >
                <ShoppingCart className="w-5 h-5" />
                {isAdding ? 'Agregado!' : 'Agregar al Carrito'}
              </button>
            </div>
          )}

          {/* Información adicional */}
          <div className="pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Información adicional
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <ShoppingCart className="w-4 h-4 mr-2 mt-0.5 text-blue-600" />
                Envío gratuito en compras mayores a $500
              </li>
              <li className="flex items-start">
                <Package className="w-4 h-4 mr-2 mt-0.5 text-blue-600" />
                Entrega estimada: 3-5 días hábiles
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}