'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface SalesChartProps {
  recentSales: Array<{
    id: string;
    saleDate: Date;
    total: number;
  }>;
}

export function SalesChart({ recentSales }: SalesChartProps) {
  const chartData = recentSales
    .slice()
    .reverse()
    .map((sale) => ({
      fecha: new Date(sale.saleDate).toLocaleDateString('es-GT', {
        month: 'short',
        day: 'numeric',
      }),
      total: sale.total,
    }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <h2 className="text-xl font-bold text-gray-800">Ventas Recientes</h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis
            dataKey="fecha"
            tick={{ fontSize: 10 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ fontSize: 11 }}
            formatter={(value: any) => `Q${value.toFixed(2)}`}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#60B5FF"
            strokeWidth={2}
            dot={{ fill: '#60B5FF', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
