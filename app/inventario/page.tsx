import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { InventoryManager } from '@/components/inventory-manager';

export const dynamic = 'force-dynamic';

async function getInventoryData() {
  const [products, movements] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { name: 'asc' },
    }),
    prisma.inventoryMovement.findMany({
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);

  return { products, movements };
}

export default async function InventarioPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const data = await getInventoryData();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Control de Inventario</h1>
        <p className="text-gray-600 mt-1">Gestiona el inventario y realiza ajustes</p>
      </div>

      <InventoryManager 
        products={data.products} 
        movements={data.movements}
        userId={(session.user as any)?.id}
      />
    </div>
  );
}
