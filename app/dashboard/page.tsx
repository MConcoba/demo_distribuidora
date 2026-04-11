import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DashboardStats } from '@/components/dashboard-stats';
import { TopProductsChart } from '@/components/top-products-chart';
import { SalesChart } from '@/components/sales-chart';
import { LowStockAlert } from '@/components/low-stock-alert';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [salesToday, salesMonth, totalProducts, lowStockProducts, topProducts, recentSales] = await Promise.all([
    prisma.sale.aggregate({
      where: {
        saleDate: { gte: today },
      },
      _sum: { total: true },
      _count: true,
    }),
    prisma.sale.aggregate({
      where: {
        saleDate: { gte: startOfMonth },
      },
      _sum: { total: true },
    }),
    prisma.product.count(),
    prisma.product.findMany({
      where: {
        stock: { lte: prisma.product.fields.minStock },
      },
      include: { category: true },
      take: 10,
    }),
    prisma.saleItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    }),
    prisma.sale.findMany({
      take: 7,
      orderBy: { saleDate: 'desc' },
      include: { user: true },
    }),
  ]);

  const topProductsData = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { category: true },
      });
      return {
        product,
        quantity: item._sum?.quantity || 0,
      };
    })
  );

  return {
    salesToday: salesToday._sum?.total || 0,
    salesTodayCount: salesToday._count || 0,
    salesMonth: salesMonth._sum?.total || 0,
    totalProducts,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    topProducts: topProductsData.filter((p) => p.product !== null),
    recentSales,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const data = await getDashboardData();

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bienvenido al panel de control</p>
      </div>

      <DashboardStats
        salesToday={data.salesToday}
        salesTodayCount={data.salesTodayCount}
        salesMonth={data.salesMonth}
        totalProducts={data.totalProducts}
        lowStockCount={data.lowStockCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalesChart recentSales={data.recentSales} />
        <TopProductsChart topProducts={data.topProducts} />
      </div>

      {data.lowStockProducts.length > 0 && (
        <LowStockAlert products={data.lowStockProducts} />
      )}
    </div>
  );
}
