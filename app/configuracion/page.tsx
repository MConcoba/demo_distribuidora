import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ColorSettings } from '@/components/color-settings';

export const dynamic = 'force-dynamic';

async function getSettings() {
  let settings = await prisma.appSettings.findUnique({
    where: { id: 'default' },
  });

  if (!settings) {
    settings = await prisma.appSettings.create({
      data: {
        id: 'default',
        primaryColor: '#2563eb',
        secondaryColor: '#7c3aed',
        accentColor: '#f59e0b',
      },
    });
  }

  return settings;
}

export default async function ConfiguracionPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const settings = await getSettings();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Configuración</h1>
        <p className="text-gray-600 mt-1">Personaliza la apariencia de la aplicación</p>
      </div>

      <ColorSettings settings={settings} />
    </div>
  );
}
