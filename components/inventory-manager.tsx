'use client';

import { useState } from 'react';
import { Plus, Minus, History, Loader2, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  sku: string;
  name: string;
  stock: number;
  category: { name: string };
}

interface Movement {
  id: string;
  type: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string | null;
  createdAt: Date;
  product: Product;
}

interface InventoryManagerProps {
  products: Product[];
  movements: Movement[];
  userId: string;
}

export function InventoryManager({ products, movements, userId }: InventoryManagerProps) {
  const router = useRouter();
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'ENTRADA' | 'SALIDA' | 'AJUSTE'>('ENTRADA');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !quantity) return;

    setLoading(true);
    try {
      const response = await fetch('/api/inventario/ajustar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          type: adjustmentType,
          quantity: parseInt(quantity),
          reason,
          userId,
        }),
      });

      if (response.ok) {
        setShowAdjustModal(false);
        setSelectedProduct(null);
        setQuantity('');
        setReason('');
        router.refresh();
      } else {
        const data = await response.json();
        alert(data?.error || 'Error al ajustar inventario');
      }
    } catch (error) {
      alert('Error al ajustar inventario');
    } finally {
      setLoading(false);
    }
  };

  const openAdjustModal = (product: Product, type: 'ENTRADA' | 'SALIDA' | 'AJUSTE') => {
    setSelectedProduct(product);
    setAdjustmentType(type);
    setShowAdjustModal(true);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          Productos en Inventario
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products?.map((product) => (
                <tr key={product?.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product?.sku}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product?.category?.name}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-blue-600">{product?.stock}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openAdjustModal(product, 'ENTRADA')}
                        className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded transition"
                      >
                        <Plus className="w-4 h-4" />
                        Entrada
                      </button>
                      <button
                        onClick={() => openAdjustModal(product, 'SALIDA')}
                        className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition"
                      >
                        <Minus className="w-4 h-4" />
                        Salida
                      </button>
                      <button
                        onClick={() => openAdjustModal(product, 'AJUSTE')}
                        className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded transition"
                      >
                        <History className="w-4 h-4" />
                        Ajuste
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-purple-600" />
          Historial de Movimientos
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Anterior</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Nuevo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Razón</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {movements?.map((movement) => {
                const typeColors = {
                  ENTRADA: 'bg-green-100 text-green-800',
                  SALIDA: 'bg-red-100 text-red-800',
                  AJUSTE: 'bg-blue-100 text-blue-800',
                };
                const typeColor = typeColors[movement?.type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800';

                return (
                  <tr key={movement?.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(movement?.createdAt)?.toLocaleString('es-GT')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{movement?.product?.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${typeColor}`}>
                        {movement?.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{movement?.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{movement?.previousStock}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">{movement?.newStock}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{movement?.reason || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAdjustModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {adjustmentType === 'ENTRADA' ? 'Entrada de Inventario' : 
               adjustmentType === 'SALIDA' ? 'Salida de Inventario' : 'Ajuste de Inventario'}
            </h3>
            <form onSubmit={handleAdjust} className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Producto: <span className="font-medium">{selectedProduct?.name}</span></p>
                <p className="text-sm text-gray-600">Stock actual: <span className="font-medium">{selectedProduct?.stock}</span></p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Razón</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Confirmar'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdjustModal(false);
                    setSelectedProduct(null);
                    setQuantity('');
                    setReason('');
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
