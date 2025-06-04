// app/api/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import qs from 'querystring';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const error = req.nextUrl.searchParams.get('error');

  // Gestion des erreurs
  if (error) {
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}`, req.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/?error=missing_code', req.url)
    );
  }

  try {
    // Échange du code contre un token
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error_description || 'Failed to authenticate');
    }

    const data = await res.json();
    
    // Création de la réponse de redirection
    const response = NextResponse.redirect(new URL('/dashboard', req.url));
    
    // Configuration des cookies
    response.cookies.set('spotify_access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: data.expires_in,
      path: '/',
    });
    
    response.cookies.set('spotify_refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(errorMessage)}`, req.url)
    );
  }
}