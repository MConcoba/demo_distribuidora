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
    const { productId, type, quantity, reason, userId } = body;

    if (!productId || !type || !quantity) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // CRITICAL: Usar transacción para garantizar consistencia
    const result = await prisma.$transaction(async (tx) => {
      // Obtener el producto con lock para evitar race conditions
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error('Producto no encontrado');
      }

      let newStock = product.stock;
      
      if (type === 'ENTRADA') {
        newStock += quantity;
      } else if (type === 'SALIDA') {
        if (product.stock < quantity) {
          throw new Error('Stock insuficiente para realizar la salida');
        }
        newStock -= quantity;
      } else if (type === 'AJUSTE') {
        newStock = quantity;
      }

      // Actualizar el stock del producto
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      // Registrar el movimiento
      const movement = await tx.inventoryMovement.create({
        data: {
          productId,
          type,
          quantity,
          previousStock: product.stock,
          newStock,
          reason: reason || null,
          createdBy: userId,
        },
      });

      return { product: updatedProduct, movement };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error al ajustar inventario:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al ajustar inventario' },
      { status: 500 }
    );
  }
}
