'use client';

import { DollarSign, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DashboardStatsProps {
  salesToday: number;
  salesTodayCount: number;
  salesMonth: number;
  totalProducts: number;
  lowStockCount: number;
}

export function DashboardStats({
  salesToday,
  salesTodayCount,
  salesMonth,
  totalProducts,
  lowStockCount,
}: DashboardStatsProps) {
  const [animatedSalesToday, setAnimatedSalesToday] = useState(0);
  const [animatedSalesMonth, setAnimatedSalesMonth] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepTime = duration / steps;

    let currentStepToday = 0;
    let currentStepMonth = 0;

    const intervalToday = setInterval(() => {
      currentStepToday++;
      setAnimatedSalesToday((salesToday / steps) * currentStepToday);
      if (currentStepToday >= steps) clearInterval(intervalToday);
    }, stepTime);

    const intervalMonth = setInterval(() => {
      currentStepMonth++;
      setAnimatedSalesMonth((salesMonth / steps) * currentStepMonth);
      if (currentStepMonth >= steps) clearInterval(intervalMonth);
    }, stepTime);

    return () => {
      clearInterval(intervalToday);
      clearInterval(intervalMonth);
    };
  }, [salesToday, salesMonth]);

  const stats = [
    {
      label: 'Ventas Hoy',
      value: `Q${animatedSalesToday.toFixed(2)}`,
      subValue: `${salesTodayCount} ventas`,
      icon: DollarSign,
      color: 'bg-blue-500',
    },
    {
      label: 'Ventas del Mes',
      value: `Q${animatedSalesMonth.toFixed(2)}`,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      label: 'Total Productos',
      value: totalProducts.toString(),
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      label: 'Stock Bajo',
      value: lowStockCount.toString(),
      icon: AlertTriangle,
      color: lowStockCount > 0 ? 'bg-red-500' : 'bg-gray-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
                {stat.subValue && (
                  <p className="text-xs text-gray-500 mt-1">{stat.subValue}</p>
                )}
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
