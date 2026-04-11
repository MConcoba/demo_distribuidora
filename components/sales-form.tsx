'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Plus, Trash2, Loader2 } from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  category: { name: string };
}

interface SaleItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

interface SalesFormProps {
  products: Product[];
  userId: string;
}

export function SalesForm({ products, userId }: SalesFormProps) {
  const router = useRouter();
  const [items, setItems] = useState<SaleItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    if (!selectedProductId || !quantity) return;

    const product = products.find((p) => p?.id === selectedProductId);
    if (!product) return;

    const qty = parseInt(quantity);
    if (qty <= 0 || qty > (product?.stock ?? 0)) {
      alert(`Stock insuficiente. Disponible: ${product?.stock}`);
      return;
    }

    const existingItem = items.find((item) => item?.productId === selectedProductId);
    if (existingItem) {
      const totalQty = (existingItem?.quantity ?? 0) + qty;
      if (totalQty > (product?.stock ?? 0)) {
        alert(`Stock insuficiente. Disponible: ${product?.stock}`);
        return;
      }
      setItems(
        items.map((item) =>
          item?.productId === selectedProductId
            ? { ...item, quantity: totalQty }
            : item
        )
      );
    } else {
      setItems([...items, {
        productId: selectedProductId,
        product,
        quantity: qty,
        price: product?.price ?? 0,
      }]);
    }

    setSelectedProductId('');
    setQuantity('1');
  };

  const removeItem = (productId: string) => {
    setItems(items.filter((item) => item?.productId !== productId));
  };

  const total = items.reduce((sum, item) => sum + (item?.quantity ?? 0) * (item?.price ?? 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Agrega al menos un producto a la venta');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item?.productId,
            quantity: item?.quantity,
            price: item?.price,
          })),
          userId,
        }),
      });

      if (response.ok) {
        alert('Venta registrada exitosamente');
        setItems([]);
        router.refresh();
      } else {
        const data = await response.json();
        alert(data?.error || 'Error al registrar la venta');
      }
    } catch (error) {
      alert('Error al registrar la venta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-blue-600" />
        Nueva Venta
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-4">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona un producto</option>
            {products?.map((product) => (
              <option key={product?.id} value={product?.id}>
                {product?.name} - Q{product?.price?.toFixed(2)} (Stock: {product?.stock})
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Cant."
          />
          <button
            type="button"
            onClick={addItem}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Agregar
          </button>
        </div>

        {items.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Producto</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Cantidad</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Precio</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Subtotal</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item?.productId}>
                    <td className="px-4 py-3 text-sm text-gray-900">{item?.product?.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item?.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">Q{item?.price?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      Q{((item?.quantity ?? 0) * (item?.price ?? 0)).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        type="button"
                        onClick={() => removeItem(item?.productId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {items.length > 0 && (
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
            <span className="text-lg font-semibold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-blue-600">Q{total.toFixed(2)}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || items.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Registrar Venta
            </>
          )}
        </button>
      </form>
    </div>
  );
}
