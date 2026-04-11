import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { ProductList } from '@/components/product-list';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getProducts() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { name: 'asc' },
  });
  return products;
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
  return categories;
}

export default async function ProductosPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const products = await getProducts();
  const categories = await getCategories();
  const isAdmin = (session.user as any)?.role === 'ADMIN';

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
          <p className="text-gray-600 mt-1">Gestiona el catálogo de productos</p>
        </div>
        {isAdmin && (
          <Link
            href="/productos/nuevo"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            Nuevo Producto
          </Link>
        )}
      </div>

      <ProductList products={products} categories={categories} isAdmin={isAdmin} />
    </div>
  );
}
