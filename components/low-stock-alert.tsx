'use client';

import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface LowStockAlertProps {
  products: Array<{
    id: string;
    name: string;
    sku: string;
    stock: number;
    minStock: number;
    category: { name: string };
  }>;
}

export function LowStockAlert({ products }: LowStockAlertProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-6 h-6 text-red-600" />
        <h2 className="text-xl font-bold text-red-800">Alertas de Stock Bajo</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-semibold text-gray-800">{product.name}</p>
            <p className="text-sm text-gray-600">SKU: {product.sku}</p>
            <p className="text-sm text-gray-600">Categoría: {product.category?.name}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-medium text-red-600">
                Stock: {product.stock}
              </span>
              <span className="text-sm text-gray-500">
                (Mínimo: {product.minStock})
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Link
          href="/inventario"
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Ver inventario completo →
        </Link>
      </div>
    </div>
  );
}
