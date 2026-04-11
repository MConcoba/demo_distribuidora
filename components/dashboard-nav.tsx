'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Warehouse,
} from 'lucide-react';

export function DashboardNav() {
  const pathname = usePathname();
  const { data: session } = useSession() || {};
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'EMPLEADO'] },
    { href: '/productos', label: 'Productos', icon: Package, roles: ['ADMIN', 'EMPLEADO'] },
    { href: '/inventario', label: 'Inventario', icon: Warehouse, roles: ['ADMIN'] },
    { href: '/ventas', label: 'Ventas', icon: ShoppingCart, roles: ['ADMIN', 'EMPLEADO'] },
    { href: '/reportes', label: 'Reportes', icon: BarChart3, roles: ['ADMIN'] },
    { href: '/usuarios', label: 'Usuarios', icon: Users, roles: ['ADMIN'] },
    { href: '/configuracion', label: 'Configuración', icon: Settings, roles: ['ADMIN'] },
  ];

  const userRole = (session?.user as any)?.role || 'EMPLEADO';
  const filteredItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Sistema Distribuidora</h1>
        <p className="text-sm text-gray-500 mt-1">{session?.user?.name}</p>
        <p className="text-xs text-gray-400">
          {isAdmin ? 'Administrador' : 'Empleado'}
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
