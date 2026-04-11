'use client';

import { useState, useEffect } from 'react';
import { Calendar, Download, User, DollarSign } from 'lucide-react';

interface SaleReport {
  userId: string;
  userName: string;
  totalSales: number;
  salesCount: number;
  sales: Array<{
    id: string;
    saleDate: string;
    total: number;
    items: Array<{
      product: { name: string };
      quantity: number;
      price: number;
    }>;
  }>;
}

export function SalesReports() {
  const [filter, setFilter] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reports, setReports] = useState<SaleReport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [filter, startDate, endDate]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      let url = `/api/reportes/ventas?filter=${filter}`;
      if (filter === 'custom' && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Error al obtener reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    let csv = 'Empleado,Total Ventas,Cantidad Ventas\n';
    reports.forEach((report) => {
      csv += `${report?.userName},${report?.totalSales?.toFixed(2)},${report?.salesCount}\n`;
    });

    csv += '\n\nDetalle de Ventas\n';
    csv += 'Empleado,Fecha,Total,Productos\n';
    reports.forEach((report) => {
      report?.sales?.forEach((sale) => {
        const productos = sale?.items?.map((item) => `${item?.product?.name} (${item?.quantity})`)?.join('; ');
        csv += `${report?.userName},${new Date(sale?.saleDate)?.toLocaleString('es-GT')},${sale?.total?.toFixed(2)},"${productos}"\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-ventas-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalGeneral = reports.reduce((sum, report) => sum + (report?.totalSales ?? 0), 0);
  const ventasGenerales = reports.reduce((sum, report) => sum + (report?.salesCount ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Hoy</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
              <option value="custom">Rango Personalizado</option>
            </select>
          </div>

          {filter === 'custom' && (
            <>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <button
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total General</p>
              <p className="text-2xl font-bold text-gray-800">Q{totalGeneral.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ventas Totales</p>
              <p className="text-2xl font-bold text-gray-800">{ventasGenerales}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Empleados Activos</p>
              <p className="text-2xl font-bold text-gray-800">{reports.length}</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">Cargando reportes...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">No hay ventas en el período seleccionado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report?.userId} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{report?.userName}</h3>
                    <p className="text-sm text-gray-600">{report?.salesCount} ventas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">Q{report?.totalSales?.toFixed(2)}</p>
                </div>
              </div>

              {report?.sales?.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Detalle de Ventas</h4>
                  <div className="space-y-2">
                    {report?.sales?.map((sale) => (
                      <div key={sale?.id} className="flex justify-between items-start text-sm bg-gray-50 p-3 rounded">
                        <div>
                          <p className="text-gray-600">
                            {new Date(sale?.saleDate)?.toLocaleString('es-GT')}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {sale?.items?.map((item) => `${item?.product?.name} (${item?.quantity})`)?.join(', ')}
                          </p>
                        </div>
                        <p className="font-semibold text-green-600">Q{sale?.total?.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
