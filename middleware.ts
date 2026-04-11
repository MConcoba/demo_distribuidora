export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/productos/:path*', '/inventario/:path*', '/ventas/:path*', '/reportes/:path*', '/configuracion/:path*', '/usuarios/:path*'],
};
