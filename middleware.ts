// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('spotify_access_token')?.value;

  // Si l'utilisateur essaie d'accéder à la page d'accueil sans token
  if (pathname === '/' && !accessToken) {
    // Pas de redirection, on laisse voir la page de connexion
    return NextResponse.next();
  }

  // Protection des routes API sauf celles nécessaires
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/login') && !pathname.startsWith('/api/callback')) {
    if (!accessToken) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return NextResponse.next();
}