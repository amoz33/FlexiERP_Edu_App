/**
 * middleware.ts  –  place this in the project root (same level as /app)
 *
 * Runs on the Edge before every matched request.
 * Unauthenticated users trying to reach /dashboard/* are sent to /login.
 * Already-logged-in users hitting /login are sent to /dashboard.
 */

import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIX = '/dashboard';
const LOGIN_PATH       = '/login';
const TOKEN_KEY        = 'flexi_token';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the token from a cookie (see note below on cookie storage)
  const token = request.cookies.get(TOKEN_KEY)?.value;

  const isProtected    = pathname.startsWith(PROTECTED_PREFIX);
  const isLoginPage    = pathname === LOGIN_PATH;

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set('from', pathname); // remember where user wanted to go
    return NextResponse.redirect(url);
  }

  if (isLoginPage && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};

/*
|--------------------------------------------------------------------------
| NOTE – localStorage vs Cookie token storage
|--------------------------------------------------------------------------
| The AuthContext above uses localStorage (simple, works well for SPAs).
| The middleware above reads a cookie because middleware runs on the server
| Edge and cannot access localStorage.
|
| To make both work together, update the saveToken() helper in AuthContext:
|
|   import Cookies from 'js-cookie'; // npm i js-cookie @types/js-cookie
|
|   function saveToken(token: string) {
|     localStorage.setItem(TOKEN_KEY, token);           // for in-app state
|     Cookies.set(TOKEN_KEY, token, {                   // for middleware
|       expires: 7,
|       sameSite: 'lax',
|       secure: process.env.NODE_ENV === 'production',
|     });
|   }
|
|   function clearToken() {
|     localStorage.removeItem(TOKEN_KEY);
|     Cookies.remove(TOKEN_KEY);
|   }
*/
