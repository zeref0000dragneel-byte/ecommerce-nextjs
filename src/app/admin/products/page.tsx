export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return products;
}

async function deleteProduct(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-title text-3xl font-bold tracking-wider text-secondary-dark">Productos</h2>
          <p className="font-medium text-gray-600 mt-2">Gestiona el catálogo ONSET</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-coral text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-glow hover:shadow-hover hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Producto
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-soft hover:shadow-hover p-8 border-2 border-gray-100 border-t-4 border-t-primary transition-all duration-300 hover:-translate-y-1">
          <p className="font-semibold text-gray-600">Total Productos</p>
          <p className="font-title text-4xl tracking-tight text-secondary-dark mt-2">{products.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-soft hover:shadow-hover p-8 border-2 border-gray-100 border-t-4 border-t-action transition-all duration-300 hover:-translate-y-1">
          <p className="font-semibold text-gray-600">En Stock</p>
          <p className="font-title text-4xl tracking-tight text-action mt-2">
            {products.filter(p => p.stock > 0).length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-soft hover:shadow-hover p-8 border-2 border-gray-100 border-t-4 border-t-accent-soft transition-all duration-300 hover:-translate-y-1">
          <p className="font-semibold text-gray-600">Sin Stock</p>
          <p className="font-title text-4xl tracking-tight text-accent-soft mt-2">
            {products.filter(p => p.stock === 0).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft p-8 border-2 border-gray-100 overflow-hidden transition-all duration-300">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="font-display text-lg font-bold text-secondary-dark mb-2">No hay productos</h3>
            <p className="text-gray-600 mb-6">Crea tu primer producto</p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-coral text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-glow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Producto
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-gray-50 to-bg-light font-bold text-secondary-dark border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">Producto</th>
                  <th className="px-6 py-4 text-left">Categoría</th>
                  <th className="px-6 py-4 text-left">Precio</th>
                  <th className="px-6 py-4 text-left">Stock</th>
                  <th className="px-6 py-4 text-left">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const productImage = product.images && product.images.length > 0 ? product.images[0] : null;

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 transition-all duration-200 hover:bg-primary/5"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover border-2 border-gray-100 shadow-soft"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-secondary-dark">{product.name}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-action/20 text-action-dark border border-action/30">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-secondary-dark">
                          ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`font-bold ${product.stock > 10 ? 'text-action' : product.stock > 0 ? 'text-warning' : 'text-accent-soft'}`}>
                          {product.stock} unidades
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {product.stock > 0 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-action/20 text-action-dark">
                            Disponible
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-accent-soft/20 text-accent-soft">
                            Agotado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="bg-gradient-to-r from-primary to-coral hover:brightness-110 text-white px-3 py-2 rounded-xl text-sm inline-flex items-center transition-all duration-300 shadow-soft hover:scale-105 font-bold"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <form action={deleteProduct} className="inline">
                            <input type="hidden" name="id" value={product.id} />
                            <button
                              type="submit"
                              className="bg-gradient-to-r from-accent-soft to-red-500 hover:brightness-110 text-white px-3 py-2 rounded-xl text-sm inline-flex items-center transition-all duration-300 shadow-soft hover:scale-105 font-bold"
                              title="Eliminar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
