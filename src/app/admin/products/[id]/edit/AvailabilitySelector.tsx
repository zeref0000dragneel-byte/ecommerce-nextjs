'use client';

import { useState, useEffect } from 'react';

function parsePreOrderDays(str: string | null): { start: number; end: number } {
  if (!str || !str.trim()) return { start: 3, end: 5 };
  const match = str.match(/(\d+)\s*a\s*(\d+)/i);
  if (match) {
    const start = Math.max(1, parseInt(match[1], 10));
    const end = Math.max(start + 1, parseInt(match[2], 10));
    return { start, end };
  }
  const num = parseInt(str.replace(/\D/g, ''), 10);
  if (!isNaN(num)) return { start: Math.max(1, num), end: Math.max(2, num + 1) };
  return { start: 3, end: 5 };
}

interface AvailabilitySelectorProps {
  defaultIsPreOrder: boolean;
  defaultPreOrderDays: string | null;
  defaultStock: number | null;
}

export default function AvailabilitySelector({
  defaultIsPreOrder,
  defaultPreOrderDays,
  defaultStock,
}: AvailabilitySelectorProps) {
  const parsed = parsePreOrderDays(defaultPreOrderDays);
  const [isPreOrder, setIsPreOrder] = useState(defaultIsPreOrder);
  const [preOrderDaysStart, setPreOrderDaysStart] = useState(parsed.start);
  const [preOrderDaysEnd, setPreOrderDaysEnd] = useState(parsed.end);
  const [stock, setStock] = useState(String(defaultStock ?? 0));

  useEffect(() => {
    const p = parsePreOrderDays(defaultPreOrderDays);
    setPreOrderDaysStart(p.start);
    setPreOrderDaysEnd(p.end);
  }, [defaultPreOrderDays]);

  const preOrderDaysValue = `${preOrderDaysStart} a ${preOrderDaysEnd} días`;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidad</label>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="availability"
            checked={!isPreOrder}
            onChange={() => setIsPreOrder(false)}
            className="h-4 w-4 text-primary"
          />
          <span>Stock normal</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="availability"
            checked={isPreOrder}
            onChange={() => setIsPreOrder(true)}
            className="h-4 w-4 text-primary"
          />
          <span>Sobre pedido</span>
        </label>
      </div>

      <input type="hidden" name="isPreOrder" value={isPreOrder ? 'true' : 'false'} />
      <input type="hidden" name="preOrderDays" value={isPreOrder ? preOrderDaysValue : ''} />
      <input type="hidden" name="stock" value={!isPreOrder ? stock : ''} />

      {isPreOrder && (
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Días de entrega estimados
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500">
              <button
                type="button"
                onClick={() => setPreOrderDaysStart((s) => Math.max(1, s - 1))}
                className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
              >
                ↓
              </button>
              <input
                type="number"
                value={preOrderDaysStart}
                onChange={(e) =>
                  setPreOrderDaysStart(Math.max(1, parseInt(e.target.value) || 1))
                }
                min={1}
                className="w-12 text-center border-none focus:ring-0 py-1.5 text-gray-900"
              />
              <button
                type="button"
                onClick={() => setPreOrderDaysStart((s) => s + 1)}
                className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
              >
                ↑
              </button>
            </div>
            <span className="text-gray-600 font-medium">a</span>
            <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500">
              <button
                type="button"
                onClick={() =>
                  setPreOrderDaysEnd((prev) => Math.max(preOrderDaysStart + 1, prev - 1))
                }
                className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
              >
                ↓
              </button>
              <input
                type="number"
                value={preOrderDaysEnd}
                onChange={(e) =>
                  setPreOrderDaysEnd(
                    Math.max(preOrderDaysStart + 1, parseInt(e.target.value) || preOrderDaysStart + 1)
                  )
                }
                min={preOrderDaysStart + 1}
                className="w-12 text-center border-none focus:ring-0 py-1.5 text-gray-900"
              />
              <button
                type="button"
                onClick={() => setPreOrderDaysEnd((prev) => prev + 1)}
                className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
              >
                ↑
              </button>
            </div>
            <span className="text-gray-600 font-medium">días</span>
          </div>
        </div>
      )}

      {!isPreOrder && (
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-4 py-2 text-gray-900"
            placeholder="0"
          />
        </div>
      )}
    </div>
  );
}
