'use client';

import { useState } from 'react';
import Link from 'next/link';

type AdminShellProps = {
  authenticated: boolean;
  children: React.ReactNode;
  logoutAction: () => void;
};

export default function AdminShell({ authenticated, children, logoutAction }: AdminShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!authenticated) {
    return <>{children}</>;
  }

  const sidebarWidth = sidebarCollapsed ? 'w-[70px]' : 'w-[220px]';
  const mainMargin = sidebarCollapsed ? 'ml-[70px]' : 'ml-[220px]';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50">
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex flex-col bg-gradient-to-b from-secondary-dark via-[#1e3a47] to-secondary-dark border-r border-white/10 text-white transition-all duration-300 ease-in-out ${sidebarWidth}`}
      >
        <div className={`flex items-center shrink-0 border-b border-white/10 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'justify-center p-3' : 'gap-3 p-4'}`}>
          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="flex-shrink-0 p-2 rounded-xl hover:bg-primary/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
          </button>
          <span
            className={`font-title text-xl tracking-wider truncate whitespace-nowrap transition-all duration-300 ease-in-out ${
              sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden min-w-0 ml-0' : 'opacity-100 ml-0'
            }`}
          >
            ONSET Admin
          </span>
        </div>

        <nav className="mt-6 flex-1 overflow-hidden">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 border-l-4 border-transparent hover:bg-primary/20 hover:border-primary transition-all duration-200 ease-in-out"
          >
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </span>
            <span className={`whitespace-nowrap transition-all duration-300 font-semibold ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              Dashboard
            </span>
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 border-l-4 border-transparent hover:bg-primary/20 hover:border-primary transition-all duration-200 ease-in-out"
          >
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </span>
            <span className={`whitespace-nowrap transition-all duration-300 font-semibold ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              Productos
            </span>
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center gap-3 px-4 py-3 border-l-4 border-transparent hover:bg-primary/20 hover:border-primary transition-all duration-200 ease-in-out"
          >
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </span>
            <span className={`whitespace-nowrap transition-all duration-300 font-semibold ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              Categorías
            </span>
          </Link>

          <Link
            href="/admin/contabilidad"
            className="flex items-center gap-3 px-4 py-3 border-l-4 border-transparent hover:bg-primary/20 hover:border-primary transition-all duration-200 ease-in-out"
          >
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className={`whitespace-nowrap transition-all duration-300 font-semibold ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              Contabilidad
            </span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-accent-soft hover:bg-accent-soft/90 rounded-xl transition-all duration-200 font-bold"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className={`whitespace-nowrap transition-all duration-300 ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                Cerrar Sesión
              </span>
            </button>
          </form>
          <Link
            href="/"
            className="mt-2 flex items-center justify-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-medium"
            title="Volver a la tienda"
          >
            {sidebarCollapsed ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            ) : (
              <span>← Volver a ONSET</span>
            )}
          </Link>
        </div>
      </aside>

      <div className={`transition-all duration-300 ease-in-out ${mainMargin}`}>
        <header className="sticky top-0 z-10 h-[70px] px-8 py-4 flex flex-col justify-center bg-gradient-to-r from-primary via-coral to-action shadow-xl border-b-4 border-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15)_0%,transparent_70%)]" aria-hidden />
          <div className="relative z-10">
            <h1 className="font-title text-2xl tracking-wider text-white">Admin ONSET</h1>
            <p className="text-sm font-medium text-white/90">Panel de gestión</p>
          </div>
        </header>
        <main className="p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
