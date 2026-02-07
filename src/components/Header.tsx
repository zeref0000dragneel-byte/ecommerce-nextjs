"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Package, Menu, X, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Inicio", icon: Zap },
    { href: "/shop", label: "Productos", icon: Package },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-r from-secondary-dark via-[#1e3a47] to-secondary-dark/98 backdrop-blur-md shadow-xl py-2 border-b border-primary/20"
          : "bg-gradient-to-r from-secondary-dark via-[#1e3a47] to-secondary-dark shadow-lg py-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${
          isScrolled ? "h-14" : "h-20"
        }`}>
          {/* Logo ONSET */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-xl blur-md opacity-80 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-gradient-to-br from-primary to-coral p-2.5 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <span className={`font-title tracking-wider text-white transition-all duration-300 ${
                isScrolled ? "text-2xl" : "text-3xl"
              }`} style={{ letterSpacing: '0.15em' }}>
                ONSET
              </span>
              <p className="text-[10px] sm:text-xs text-primary/90 font-semibold uppercase tracking-widest hidden sm:block">
                Tu estilo, tu inicio
              </p>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-coral text-white shadow-glow"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Carrito y Menú Móvil */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative group"
            >
              <div className="relative p-2.5 rounded-xl bg-gradient-to-r from-primary to-coral text-white shadow-card hover:shadow-glow transition-all duration-300 transform hover:scale-105 active:scale-95">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent-soft text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center animate-pulse shadow-lg">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </div>
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/20 bg-secondary-dark/98 backdrop-blur-md animate-slideDown">
          <nav className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-coral text-white shadow-glow"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
