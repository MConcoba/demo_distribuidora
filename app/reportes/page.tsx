import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { SalesReports } from '@/components/sales-reports';

export default async function ReportesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reportes de Ventas</h1>
        <p className="text-gray-600 mt-1">Analiza el desempeño de ventas por empleado</p>
      </div>

      <SalesReports />
    </div>
  );
}
