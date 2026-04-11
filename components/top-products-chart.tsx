'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package } from 'lucide-react';

interface TopProductsChartProps {
  topProducts: Array<{
    product: any;
    quantity: number;
  }>;
}

export function TopProductsChart({ topProducts }: TopProductsChartProps) {
  const chartData = topProducts.map((item) => ({
    name: item.product?.name?.substring(0, 15) || 'Producto',
    cantidad: item.quantity,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Productos Más Vendidos</h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10 }}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ fontSize: 11 }}
          />
          <Bar dataKey="cantidad" fill="#60B5FF" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
