import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { primaryColor, secondaryColor, accentColor } = body;

    const settings = await prisma.appSettings.upsert({
      where: { id: 'default' },
      update: {
        primaryColor,
        secondaryColor,
        accentColor,
      },
      create: {
        id: 'default',
        primaryColor,
        secondaryColor,
        accentColor,
      },
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Error al actualizar colores:', error);
    return NextResponse.json({ error: 'Error al actualizar colores' }, { status: 500 });
  }
}
