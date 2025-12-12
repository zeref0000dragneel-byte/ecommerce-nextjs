"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Store, Package, LayoutDashboard } from "lucide-react";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
            <Store className="w-8 h-8" />
            <span className="text-xl font-bold">Mi Tienda</span>
          </Link>

          {/* Navegación */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition flex items-center space-x-1"
            >
              <Store className="w-4 h-4" />
              <span>Inicio</span>
            </Link>
            <Link
              href="/shop"
              className="text-gray-700 hover:text-blue-600 transition flex items-center space-x-1"
            >
              <Package className="w-4 h-4" />
              <span>Productos</span>
            </Link>
            <Link
              href="/admin"
              className="text-gray-700 hover:text-blue-600 transition flex items-center space-x-1"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Carrito */}
          <Link
            href="/cart"
            className="relative flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Carrito</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Navegación móvil */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          <Link
            href="/"
            className="flex flex-col items-center text-gray-600 hover:text-blue-600 py-2"
          >
            <Store className="w-5 h-5" />
            <span className="text-xs mt-1">Inicio</span>
          </Link>
          <Link
            href="/shop"
            className="flex flex-col items-center text-gray-600 hover:text-blue-600 py-2"
          >
            <Package className="w-5 h-5" />
            <span className="text-xs mt-1">Productos</span>
          </Link>
          <Link
            href="/admin"
            className="flex flex-col items-center text-gray-600 hover:text-blue-600 py-2"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-xs mt-1">Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}