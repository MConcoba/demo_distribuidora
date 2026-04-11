'use client';

import { Clock } from 'lucide-react';

interface Sale {
  id: string;
  saleDate: Date;
  total: number;
  user: { name: string };
  items: Array<{
    product: { name: string };
    quantity: number;
  }>;
}

interface RecentSalesListProps {
  sales: Sale[];
}

export function RecentSalesList({ sales }: RecentSalesListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-purple-600" />
        Ventas Recientes
      </h2>
      <div className="space-y-4">
        {sales?.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay ventas registradas</p>
        ) : (
          sales?.map((sale) => (
            <div key={sale?.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-600">
                    {new Date(sale?.saleDate)?.toLocaleString('es-GT')}
                  </p>
                  <p className="text-xs text-gray-500">Por: {sale?.user?.name}</p>
                </div>
                <p className="text-lg font-bold text-green-600">Q{sale?.total?.toFixed(2)}</p>
              </div>
              <div className="text-xs text-gray-600">
                {sale?.items?.length} producto(s)
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
