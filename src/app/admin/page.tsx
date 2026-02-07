export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { requireAuth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { Plus, ShoppingBag, DollarSign, TrendingDown, Package, Layers, AlertCircle } from 'lucide-react';

async function getStats() {
  const [productsCount, categoriesCount, pendingSales, totalSalesSum, totalExpensesSum] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.accountingSale.count({
      where: {
        OR: [{ status: 'parcial' }, { status: 'pendiente' }],
      },
    }),
    prisma.accountingSale.aggregate({ _sum: { amount: true } }),
    prisma.accountingExpense.aggregate({ _sum: { amount: true } }),
  ]);

  const totalBalance = (totalSalesSum._sum.amount ?? 0) - (totalExpensesSum._sum.amount ?? 0);

  return {
    productsCount,
    categoriesCount,
    pendingCount: pendingSales,
    totalBalance,
  };
}

export default async function AdminDashboard() {
  await requireAuth('/admin');

  const stats = await getStats();

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-3xl font-black text-secondary-dark tracking-tight">DASHBOARD</h1>
        <p className="text-sm text-gray-600">Resumen general de ONSET</p>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        {/* Productos */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border-t-4 border-primary hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 font-bold text-xs uppercase tracking-wide">Productos</h3>
              <div className="p-2.5 bg-primary-50 rounded-lg">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-4xl font-black text-secondary-dark mb-1">{stats.productsCount}</p>
            <p className="text-xs text-gray-500">Total en catálogo</p>
          </div>
        </div>

        {/* Categorías */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border-t-4 border-action hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 font-bold text-xs uppercase tracking-wide">Categorías</h3>
              <div className="p-2.5 bg-action-50 rounded-lg">
                <Layers className="w-6 h-6 text-action" />
              </div>
            </div>
            <p className="text-4xl font-black text-secondary-dark mb-1">{stats.categoriesCount}</p>
            <p className="text-xs text-gray-500">Activas</p>
          </div>
        </div>

        {/* Pendientes */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border-t-4 border-warning hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 font-bold text-xs uppercase tracking-wide">Pendientes</h3>
              <div className="p-2.5 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
            </div>
            <p className="text-4xl font-black text-secondary-dark mb-1">{stats.pendingCount}</p>
            <p className="text-xs text-gray-500">Ventas por cobrar</p>
          </div>
        </div>
      </div>

      {/* Reporte Financiero - Destacado */}
      <Link
        href="/admin/contabilidad"
        className="block group mb-5"
      >
        <div className="bg-gradient-to-r from-primary via-coral to-primary-dark rounded-xl shadow-lg hover:shadow-xl transition-all py-6 px-6 relative overflow-hidden">
          {/* Efecto de brillo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
          
          <div className="relative z-10">
            <p className="text-white/90 font-bold text-base mb-1">Reporte Financiero</p>
            <h2 className="text-white font-black text-5xl tracking-tight mb-1">
              ${stats.totalBalance.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-white/80 text-sm">Saldo total acumulado</p>
          </div>
        </div>
      </Link>

      {/* Acciones Rápidas */}
      <div>
        <h2 className="text-xl font-black text-secondary-dark mb-4 uppercase tracking-tight">
          Acciones Rápidas
        </h2>
        
        {/* Primera fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Registrar Venta */}
          <Link
            href="/admin/contabilidad?tab=ventas"
            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 border-l-4 border-primary"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-50 rounded-xl group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-secondary-dark">Contabilidad: Registrar Venta</h3>
                <p className="text-xs text-gray-600">Ir a ventas</p>
              </div>
            </div>
          </Link>

          {/* Registrar Gasto */}
          <Link
            href="/admin/contabilidad?tab=gastos"
            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 border-l-4 border-action"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-action-50 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingDown className="w-6 h-6 text-action" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-secondary-dark">Contabilidad: Registrar Gasto</h3>
                <p className="text-xs text-gray-600">Ir a gastos</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Segunda fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nuevo Producto */}
          <Link
            href="/admin/products/new"
            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 border-l-4 border-coral"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-50 rounded-xl group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-coral" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-secondary-dark">Nuevo Producto</h3>
                <p className="text-xs text-gray-600">Agregar al catálogo</p>
              </div>
            </div>
          </Link>

          {/* Ver Productos */}
          <Link
            href="/admin/products"
            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 border-l-4 border-accent-electric"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-50 rounded-xl group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6 text-accent-electric" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-secondary-dark">Ver Productos</h3>
                <p className="text-xs text-gray-600">Gestionar catálogo</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
