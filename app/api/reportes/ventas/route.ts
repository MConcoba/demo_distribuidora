import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'today';
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    let startDate: Date;
    let endDate: Date = new Date();

    if (filter === 'today') {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } else if (filter === 'week') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    } else if (filter === 'month') {
      startDate = new Date();
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    } else if (filter === 'custom' && startDateParam && endDateParam) {
      startDate = new Date(startDateParam);
      endDate = new Date(endDateParam);
      endDate.setHours(23, 59, 59, 999);
    } else {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    }

    const sales = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { saleDate: 'desc' },
    });

    const reportsByUser: { [key: string]: any } = {};

    sales.forEach((sale) => {
      const userId = sale?.user?.id;
      if (!reportsByUser[userId]) {
        reportsByUser[userId] = {
          userId,
          userName: sale?.user?.name,
          totalSales: 0,
          salesCount: 0,
          sales: [],
        };
      }

      reportsByUser[userId].totalSales += sale?.total ?? 0;
      reportsByUser[userId].salesCount += 1;
      reportsByUser[userId].sales.push({
        id: sale?.id,
        saleDate: sale?.saleDate,
        total: sale?.total,
        items: sale?.items,
      });
    });

    const reports = Object.values(reportsByUser).sort(
      (a: any, b: any) => (b?.totalSales ?? 0) - (a?.totalSales ?? 0)
    );

    return NextResponse.json(reports);
  } catch (error: any) {
    console.error('Error al obtener reportes:', error);
    return NextResponse.json({ error: 'Error al obtener reportes' }, { status: 500 });
  }
}
