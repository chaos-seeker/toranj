import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const logginedRoutes = ['/profile', '/orders'];

export async function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  const cookieStore = await cookies();
  const isAuth = Boolean(cookieStore.get('token')?.value);

  if (
    logginedRoutes.some((item) => request.nextUrl.pathname.startsWith(item)) &&
    !isAuth
  ) {
    return NextResponse.redirect(new URL(`/?toggle-login=true`, request.url));
  }

  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: ['/:path*'],
};
