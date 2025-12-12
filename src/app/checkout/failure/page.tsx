'use client';

import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';

export default function FailurePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pago Rechazado
          </h1>
          
          <p className="text-gray-600 mb-8">
            Hubo un problema al procesar tu pago
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-bold text-gray-900 mb-3">
              Posibles razones:
            </h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>Fondos insuficientes</li>
              <li>Datos de tarjeta incorrectos</li>
              <li>Transacción rechazada por el banco</li>
              <li>Límite de compra excedido</li>
            </ul>
          </div>

          <div className="text-sm text-gray-600 mb-6">
            <p>No se realizó ningún cargo a tu cuenta.</p>
            <p>Puedes intentar nuevamente con otro método de pago.</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/cart')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Volver al Carrito
            </button>
            <button
              onClick={() => router.push('/shop')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition"
            >
              Seguir Comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}