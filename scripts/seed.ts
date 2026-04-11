import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de la base de datos...');

  // Crear categor\u00edas
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Bebidas' },
      update: {},
      create: { name: 'Bebidas' },
    }),
    prisma.category.upsert({
      where: { name: 'Alimentos' },
      update: {},
      create: { name: 'Alimentos' },
    }),
    prisma.category.upsert({
      where: { name: 'Limpieza' },
      update: {},
      create: { name: 'Limpieza' },
    }),
    prisma.category.upsert({
      where: { name: 'Snacks' },
      update: {},
      create: { name: 'Snacks' },
    }),
    prisma.category.upsert({
      where: { name: 'L\u00e1cteos' },
      update: {},
      create: { name: 'L\u00e1cteos' },
    }),
  ]);

  console.log('Categor\u00edas creadas:', categories.length);

  // Crear usuarios
  const hashedPassword = await bcrypt.hash('johndoe123', 10);
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const adminDistribuidora = await prisma.user.upsert({
    where: { email: 'admin@distribuidora.com' },
    update: {},
    create: {
      email: 'admin@distribuidora.com',
      name: 'Administrador',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });

  const employee1 = await prisma.user.upsert({
    where: { email: 'maria@distribuidora.com' },
    update: {},
    create: {
      email: 'maria@distribuidora.com',
      name: 'Mar\u00eda L\u00f3pez',
      password: await bcrypt.hash('maria123', 10),
      role: 'EMPLEADO',
    },
  });

  const employee2 = await prisma.user.upsert({
    where: { email: 'carlos@distribuidora.com' },
    update: {},
    create: {
      email: 'carlos@distribuidora.com',
      name: 'Carlos Garc\u00eda',
      password: await bcrypt.hash('carlos123', 10),
      role: 'EMPLEADO',
    },
  });

  const employee3 = await prisma.user.upsert({
    where: { email: 'ana@distribuidora.com' },
    update: {},
    create: {
      email: 'ana@distribuidora.com',
      name: 'Ana Mart\u00ednez',
      password: await bcrypt.hash('ana123', 10),
      role: 'EMPLEADO',
    },
  });

  console.log('Usuarios creados: 5 (2 admin, 3 empleados)');

  // Crear productos
  const products = [
    {
      sku: 'BEB-001',
      name: 'Coca Cola 2L',
      description: 'Bebida gaseosa de cola 2 litros',
      price: 12.50,
      stock: 48,
      minStock: 10,
      categoryId: categories[0].id,
    },
    {
      sku: 'BEB-002',
      name: 'Agua Pura 600ml',
      description: 'Agua purificada en botella',
      price: 2.00,
      stock: 120,
      minStock: 20,
      categoryId: categories[0].id,
    },
    {
      sku: 'BEB-003',
      name: 'Jugo de Naranja 1L',
      description: 'Jugo natural de naranja',
      price: 15.00,
      stock: 30,
      minStock: 8,
      categoryId: categories[0].id,
    },
    {
      sku: 'ALI-001',
      name: 'Arroz Blanco 1 libra',
      description: 'Arroz blanco de grano largo',
      price: 6.50,
      stock: 75,
      minStock: 15,
      categoryId: categories[1].id,
    },
    {
      sku: 'ALI-002',
      name: 'Frijol Negro 1 libra',
      description: 'Frijol negro premium',
      price: 8.00,
      stock: 60,
      minStock: 12,
      categoryId: categories[1].id,
    },
    {
      sku: 'ALI-003',
      name: 'Aceite Vegetal 750ml',
      description: 'Aceite vegetal para cocinar',
      price: 22.00,
      stock: 40,
      minStock: 10,
      categoryId: categories[1].id,
    },
    {
      sku: 'LIM-001',
      name: 'Jab\u00f3n L\u00edquido 1L',
      description: 'Jab\u00f3n l\u00edquido para trastes',
      price: 18.50,
      stock: 25,
      minStock: 8,
      categoryId: categories[2].id,
    },
    {
      sku: 'LIM-002',
      name: 'Cloro 1L',
      description: 'Blanqueador desinfectante',
      price: 12.00,
      stock: 35,
      minStock: 10,
      categoryId: categories[2].id,
    },
    {
      sku: 'SNK-001',
      name: 'Papas Fritas 150g',
      description: 'Papas fritas sabor natural',
      price: 8.00,
      stock: 6,
      minStock: 15,
      categoryId: categories[3].id,
    },
    {
      sku: 'SNK-002',
      name: 'Galletas de Chocolate',
      description: 'Galletas con chips de chocolate',
      price: 10.00,
      stock: 45,
      minStock: 10,
      categoryId: categories[3].id,
    },
    {
      sku: 'LAC-001',
      name: 'Leche Entera 1L',
      description: 'Leche entera pasteurizada',
      price: 9.50,
      stock: 50,
      minStock: 12,
      categoryId: categories[4].id,
    },
    {
      sku: 'LAC-002',
      name: 'Yogurt Natural 200g',
      description: 'Yogurt natural sin az\u00facar',
      price: 6.00,
      stock: 8,
      minStock: 15,
      categoryId: categories[4].id,
    },
    {
      sku: 'LAC-003',
      name: 'Queso Fresco 1 libra',
      description: 'Queso fresco tipo guatemalteco',
      price: 25.00,
      stock: 20,
      minStock: 8,
      categoryId: categories[4].id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
  }

  console.log('Productos creados:', products.length);

  // Crear algunas ventas de ejemplo
  const allProducts = await prisma.product.findMany();
  const employees = [employee1, employee2, employee3];

  // Venta 1 - Mar\u00eda
  const sale1 = await prisma.sale.create({
    data: {
      userId: employee1.id,
      total: 0,
      saleDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 d\u00edas atr\u00e1s
    },
  });

  await prisma.saleItem.create({
    data: {
      saleId: sale1.id,
      productId: allProducts[0].id,
      quantity: 3,
      price: allProducts[0].price,
      subtotal: 3 * allProducts[0].price,
    },
  });

  await prisma.saleItem.create({
    data: {
      saleId: sale1.id,
      productId: allProducts[1].id,
      quantity: 6,
      price: allProducts[1].price,
      subtotal: 6 * allProducts[1].price,
    },
  });

  const sale1Total = 3 * allProducts[0].price + 6 * allProducts[1].price;
  await prisma.sale.update({
    where: { id: sale1.id },
    data: { total: sale1Total },
  });

  // Venta 2 - Carlos
  const sale2 = await prisma.sale.create({
    data: {
      userId: employee2.id,
      total: 0,
      saleDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 d\u00eda atr\u00e1s
    },
  });

  await prisma.saleItem.create({
    data: {
      saleId: sale2.id,
      productId: allProducts[3].id,
      quantity: 5,
      price: allProducts[3].price,
      subtotal: 5 * allProducts[3].price,
    },
  });

  await prisma.saleItem.create({
    data: {
      saleId: sale2.id,
      productId: allProducts[4].id,
      quantity: 4,
      price: allProducts[4].price,
      subtotal: 4 * allProducts[4].price,
    },
  });

  const sale2Total = 5 * allProducts[3].price + 4 * allProducts[4].price;
  await prisma.sale.update({
    where: { id: sale2.id },
    data: { total: sale2Total },
  });

  // Venta 3 - Ana (hoy)
  const sale3 = await prisma.sale.create({
    data: {
      userId: employee3.id,
      total: 0,
      saleDate: new Date(),
    },
  });

  await prisma.saleItem.create({
    data: {
      saleId: sale3.id,
      productId: allProducts[10].id,
      quantity: 2,
      price: allProducts[10].price,
      subtotal: 2 * allProducts[10].price,
    },
  });

  const sale3Total = 2 * allProducts[10].price;
  await prisma.sale.update({
    where: { id: sale3.id },
    data: { total: sale3Total },
  });

  console.log('Ventas de ejemplo creadas: 3');

  // Crear configuraci\u00f3n de colores por defecto
  await prisma.appSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      primaryColor: '#2563eb',
      secondaryColor: '#7c3aed',
      accentColor: '#f59e0b',
    },
  });

  console.log('Configuraci\u00f3n de colores creada');
  console.log('\u2705 Seed completado exitosamente!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error en seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
