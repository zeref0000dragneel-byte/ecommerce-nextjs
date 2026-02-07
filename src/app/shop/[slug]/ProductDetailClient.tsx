'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, ShoppingCart, X } from 'lucide-react';
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
  isPreOrder?: boolean;
  preOrderDays?: string | null;
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

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

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

  const currentPrice = selectedVariant?.price || product.price;
  const isPreOrder = product.isPreOrder ?? false;
  const currentStock = selectedVariant?.stock ?? product.stock ?? 0;
  const currentImage = selectedVariant?.imageUrl || product.imageUrl;

  const handleVariantClick = (variant: Variant) => {
    if (selectedVariant?.id === variant.id) {
      setSelectedVariant(null);
    } else {
      setSelectedVariant(variant);
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);

    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: currentPrice,
        imageUrl: currentImage,
        stock: isPreOrder ? 999 : currentStock,
        variantId: selectedVariant?.id,
        variantDetails: selectedVariant
          ? `${selectedVariant.color || ''}${selectedVariant.color && selectedVariant.size ? ' - ' : ''}${selectedVariant.size || ''}`.trim()
          : undefined,
        isPreOrder,
        preOrderDays: product.preOrderDays,
      },
      quantity
    );

    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleWhatsAppRedirect = () => {
    const preOrderText = isPreOrder
      ? ` (⚠️ Sobre pedido: ${product.preOrderDays || "consultar"})`
      : "";
    const variantDetails = selectedVariant
      ? `, Variante: ${selectedVariant.color || ''}${selectedVariant.color && selectedVariant.size ? ' - ' : ''}${selectedVariant.size || ''}`.trim()
      : '';
    const message =
      `Hola, me interesa el producto: *${product.name}*${preOrderText}${variantDetails}\n\n` +
      `Precio: $${currentPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN\n` +
      `Cantidad: ${quantity}\n\n¿Está disponible?`;
    window.open(`https://wa.me/5219516111552?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-hover overflow-hidden border-2 border-gray-100">
      <div className="grid md:grid-cols-2 gap-8 p-8">
        <div className="relative aspect-square bg-gradient-to-br from-bg-light to-gray-100 rounded-2xl overflow-hidden border-2 border-gray-100">
          {currentImage ? (
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Package className="w-32 h-32" />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <Link
            href={`/shop?category=${product.category.id}`}
            className="inline-block text-sm font-bold text-action hover:text-action-dark mb-2 transition-colors"
          >
            {product.category.name}
          </Link>

          <h1 className="font-display text-3xl font-bold text-secondary-dark mb-4">
            {product.name}
          </h1>

          <div className="mb-6">
            <span className="text-4xl font-title text-primary tracking-tight">
              ${currentPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </span>
            {product.comparePrice && (
              <span className="ml-3 text-xl text-gray-400 line-through font-medium">
                ${product.comparePrice.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-secondary-dark mb-3">
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
                      className={`px-4 py-2 border-2 rounded-xl font-bold transition-all duration-300 ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary shadow-soft'
                          : 'border-gray-300 hover:border-primary/50 text-gray-700'
                      }`}
                    >
                      {color}
                      {isSelected && <X className="w-4 h-4 inline ml-1" />}
                    </button>
                  );
                })}
              </div>
              {selectedVariant && (
                <p className="text-xs text-gray-500 mt-2 font-medium">
                  Clic de nuevo para volver al original
                </p>
              )}
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-secondary-dark mb-3">
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
                      className={`px-4 py-2 border-2 rounded-xl font-bold transition-all duration-300 ${
                        isSelected
                          ? 'border-action bg-action/10 text-action shadow-soft'
                          : variant && variant.stock > 0
                          ? 'border-gray-300 hover:border-action/50 text-gray-700'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {size}
                      {isSelected && <X className="w-4 h-4 inline ml-1" />}
                    </button>
                  );
                })}
              </div>
              {selectedVariant && (
                <p className="text-xs text-gray-500 mt-2 font-medium">
                  Clic de nuevo para volver al original
                </p>
              )}
            </div>
          )}

          <div className="mb-6">
            {isPreOrder ? (
              <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-700 px-4 py-2 rounded-xl font-bold">
                <span className="w-2 h-2 bg-orange-500 rounded-full" />
                Sobre pedido{product.preOrderDays ? ` (${product.preOrderDays})` : ''}
              </div>
            ) : currentStock === 0 ? (
              <div className="inline-flex items-center bg-accent-soft/20 text-accent-soft px-4 py-2 rounded-xl font-bold">
                Agotado
              </div>
            ) : currentStock <= 5 ? (
              <div className="inline-flex items-center bg-warning/20 text-secondary-dark px-4 py-2 rounded-xl font-bold">
                ¡Solo quedan {currentStock}!
              </div>
            ) : (
              <div className="inline-flex items-center bg-action/20 text-action-dark px-4 py-2 rounded-xl font-bold">
                {currentStock} disponibles
              </div>
            )}
          </div>

          {product.description && (
            <div className="mb-8">
              <h2 className="font-display text-lg font-bold text-secondary-dark mb-2">
                Descripción
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {(isPreOrder || currentStock > 0) && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={handleWhatsAppRedirect}
                className="bg-whatsapp hover:bg-[#128C7E] text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-float hover:scale-105 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Hazlo Tuyo
              </button>

              <div className="flex items-center gap-2">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-bold transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={isPreOrder ? 999 : currentStock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.min(
                          isPreOrder ? 999 : currentStock,
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      )
                    }
                    className="w-12 text-center border-x border-gray-200 py-2 text-secondary-dark font-bold"
                  />
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(isPreOrder ? 999 : currentStock, quantity + 1)
                      )
                    }
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 bg-gradient-to-r from-primary to-coral text-white px-4 py-3 rounded-xl hover:shadow-glow transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 font-bold hover:scale-105 active:scale-95"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isAdding ? 'Agregado!' : 'Agregar'}
                </button>
              </div>
            </div>
          )}

          <div className="pt-8 border-t-2 border-gray-100">
            <h3 className="text-sm font-bold text-secondary-dark mb-4">
              Info
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 font-medium">
              <li className="flex items-start gap-2">
                <ShoppingCart className="w-4 h-4 mt-0.5 text-action flex-shrink-0" />
                Entrega gratis en COBAO PL 42
              </li>
              <li className="flex items-start gap-2">
                <Package className="w-4 h-4 mt-0.5 text-action flex-shrink-0" />
                Entrega estimada: 2-3 días hábiles
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
