import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { ProductForm } from '@/components/product-form';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  return product;
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
  return categories;
}

export default async function EditarProductoPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }

  const categories = await getCategories();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Editar Producto</h1>
        <p className="text-gray-600 mt-1">Actualiza la información del producto</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  );
}
