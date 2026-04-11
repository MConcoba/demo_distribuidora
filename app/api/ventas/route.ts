import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { items, userId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Debe incluir al menos un producto' },
        { status: 400 }
      );
    }

    // CRITICAL: Usar transacción para garantizar atomicidad
    const result = await prisma.$transaction(async (tx) => {
      let totalSale = 0;

      // Validar stock y calcular total
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Producto ${item.productId} no encontrado`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Stock insuficiente para ${product.name}. Disponible: ${product.stock}, Solicitado: ${item.quantity}`
          );
        }

        totalSale += item.quantity * item.price;
      }

      // Crear la venta
      const sale = await tx.sale.create({
        data: {
          userId,
          total: totalSale,
          saleDate: new Date(),
        },
      });

      // Procesar cada item
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) continue;

        // Crear el item de venta
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.quantity * item.price,
          },
        });

        // Actualizar stock del producto
        const newStock = product.stock - item.quantity;
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: newStock },
        });

        // Registrar movimiento de inventario
        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            type: 'SALIDA',
            quantity: item.quantity,
            previousStock: product.stock,
            newStock,
            reason: `Venta #${sale.id}`,
            createdBy: userId,
          },
        });
      }

      return sale;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Error al registrar venta:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al registrar venta' },
      { status: 500 }
    );
  }
}
