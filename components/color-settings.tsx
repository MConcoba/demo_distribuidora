'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Palette, Save, Loader2 } from 'lucide-react';

interface ColorSettingsProps {
  settings: {
    id: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

export function ColorSettings({ settings }: ColorSettingsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState({
    primaryColor: settings?.primaryColor || '#2563eb',
    secondaryColor: settings?.secondaryColor || '#7c3aed',
    accentColor: settings?.accentColor || '#f59e0b',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/configuracion/colores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(colors),
      });

      if (response.ok) {
        alert('Colores actualizados exitosamente');
        router.refresh();
      } else {
        alert('Error al actualizar colores');
      }
    } catch (error) {
      alert('Error al actualizar colores');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Personalización de Colores</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color Primario
          </label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={colors.primaryColor}
              onChange={(e) => setColors({ ...colors, primaryColor: e.target.value })}
              className="w-20 h-12 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={colors.primaryColor}
              onChange={(e) => setColors({ ...colors, primaryColor: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Usado en botones principales y elementos de navegación
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color Secundario
          </label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={colors.secondaryColor}
              onChange={(e) => setColors({ ...colors, secondaryColor: e.target.value })}
              className="w-20 h-12 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={colors.secondaryColor}
              onChange={(e) => setColors({ ...colors, secondaryColor: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Usado en elementos de soporte y detalles
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color de Acento
          </label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={colors.accentColor}
              onChange={(e) => setColors({ ...colors, accentColor: e.target.value })}
              className="w-20 h-12 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={colors.accentColor}
              onChange={(e) => setColors({ ...colors, accentColor: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Usado para resaltar elementos importantes
          </p>
        </div>

        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Los cambios de color se aplicarán inmediatamente en toda la aplicación. 
          Recarga la página si no ves los cambios reflejados.
        </p>
      </div>
    </div>
  );
}
