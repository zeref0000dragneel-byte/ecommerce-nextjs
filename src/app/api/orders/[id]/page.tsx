'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Edit,
  Save,
  X,
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  shippingAddress: string | null;
  customer: {
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      imageUrl: string | null;
      slug: string;
    };
  }>;
}

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const router = useRouter();
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    params.then((p) => {
      setOrderId(p.id);
      fetchOrder(p.id);
    });
  }, [params]);

  const fetchOrder = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${id}`);
      if (!response.ok) {
        throw new Error('Pedido no encontrado');
      }
      const data = await response.json();
      setOrder(data);
      setNewStatus(data.status);
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Error al cargar el pedido');
      router.push('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!order || newStatus === order.status) {
      setEditingStatus(false);
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }

      const data = await response.json();
      setOrder(data.order);
      setEditingStatus(false);
      alert('Estado actualizado exitosamente');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar el estado');
    } finally {
      setUpdating(false);
    }
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'Pendiente',
    PAID: 'Pagado',
    PROCESSING: 'En proceso',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  };

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Cargando pedido...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-gray-600 mb-4">Pedido no encontrado</div>
        <Link
          href="/admin/orders"
          className="text-blue-600 hover:text-blue-800"
        >
          Volver a pedidos
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a pedidos
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Pedido {order.orderNumber}
            </h1>
            <p className="text-gray-600 mt-1">
              Creado el{' '}
              {new Date(order.createdAt).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Estado del pedido */}
          <div className="flex items-center gap-3">
            {!editingStatus ? (
              <>
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    statusColors[order.status]
                  }`}
                >
                  {statusLabels[order.status]}
                </span>
                <button
                  onClick={() => setEditingStatus(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  <Edit className="w-4 h-4" />
                  Cambiar estado
                </button>
              </>
            ) : (
              <>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                >
                  <Save className="w-4 h-4" />
                  {updating ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={() => {
                    setEditingStatus(false);
                    setNewStatus(order.status);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenido principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Productos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Productos ({order.items.length})
              </h2>
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b last:border-0"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/shop/${item.product.slug}`}
                      target="_blank"
                      className="font-semibold text-gray-900 hover:text-blue-600 transition"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      Cantidad: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Precio unitario: ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${order.total.toFixed(2)} MXN</span>
              </div>
            </div>
          </div>

          {/* Información del cliente */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Información del cliente
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-medium text-gray-900">
                    {order.customer.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">
                    {order.customer.email}
                  </p>
                </div>
              </div>

              {order.customer.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-medium text-gray-900">
                      {order.customer.phone}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Dirección de entrega</p>
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress || order.customer.address || 'No especificada'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Resumen
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Fecha del pedido</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('es-MX')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pb-3 border-b">
                <Package className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Productos</p>
                  <p className="font-medium text-gray-900">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}{' '}
                    unidades
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <Link
                href={`/orders/${order.id}/confirmation`}
                target="_blank"
                className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Ver como cliente
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}