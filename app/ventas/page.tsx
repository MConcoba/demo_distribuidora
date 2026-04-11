import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { SalesForm } from '@/components/sales-form';
import { RecentSalesList } from '@/components/recent-sales-list';

export const dynamic = 'force-dynamic';

async function getSalesData() {
  const [products, recentSales] = await Promise.all([
    prisma.product.findMany({
      where: { stock: { gt: 0 } },
      include: { category: true },
      orderBy: { name: 'asc' },
    }),
    prisma.sale.findMany({
      take: 10,
      orderBy: { saleDate: 'desc' },
      include: {
        user: true,
        items: {
          include: { product: true },
        },
      },
    }),
  ]);

  return { products, recentSales };
}

export default async function VentasPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const data = await getSalesData();
  const userId = (session.user as any)?.id;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Registro de Ventas</h1>
        <p className="text-gray-600 mt-1">Registra nuevas ventas de productos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SalesForm products={data.products} userId={userId} />
        </div>
        <div>
          <RecentSalesList sales={data.recentSales} />
        </div>
      </div>
    </div>
  );
}
