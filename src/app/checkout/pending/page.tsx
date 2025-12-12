'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Clock, Loader2, Package } from 'lucide-react';

function PendingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data.order);
        }
      } catch (error) {
        console.error('Error al cargar pedido:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-yellow-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pago Pendiente
          </h1>
          
          <p className="text-gray-600 mb-8">
            Tu pago está siendo procesado
          </p>

          {order && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Pedido #{order.orderNumber}
                </h2>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-gray-900">
                    ${order.total.toFixed(2)} MXN
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estado:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    PENDIENTE
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600 mb-6">
            <p className="mb-2">Tu pago está siendo verificado.</p>
            <p className="mb-2">Recibirás una notificación cuando se confirme.</p>
            <p className="font-medium">Esto puede tardar unos minutos.</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/shop')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Seguir Comprando
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
      </div>
    }>
      <PendingContent />
    </Suspense>
  );
}