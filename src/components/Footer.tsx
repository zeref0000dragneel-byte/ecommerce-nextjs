"use client";

import Link from "next/link";
import { Zap, Mail, MessageCircle } from "lucide-react";

const EMAIL = "mailto:aaroneli874@gmail.com";
const WHATSAPP_URL = "https://wa.me/529516111552";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-secondary-dark via-[#1e3a47] to-secondary-dark text-white py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-primary to-coral p-2.5 rounded-xl transition-transform duration-300 hover:scale-105">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="font-title text-2xl tracking-wider">ONSET</span>
            </div>
            <p className="text-white/70 text-sm">
              Tu estilo, tu inicio. Energía y impacto.
            </p>
          </div>
          <div>
            <h3 className="font-display font-bold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-primary transition-colors duration-200">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-primary transition-colors duration-200">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-primary transition-colors duration-200">
                  Carrito
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display font-bold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a
                  href={EMAIL}
                  className="inline-flex items-center gap-2 text-white/90 hover:text-primary transition-colors duration-200 group"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span>aaroneli874@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/90 hover:text-whatsapp transition-colors duration-200 group"
                >
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-white/70 text-sm">
            © {new Date().getFullYear()} ONSET. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
