import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect('https://spotify-next-js-one.vercel.app/?error=no_code');
  }

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!
      })
    });

    const data = await tokenResponse.json();
    
    
    const response = NextResponse.redirect('https://spotify-next-js-one.vercel.app/dashboard');
    response.cookies.set('spotify_access_token', data.access_token, {
      httpOnly: true,
      secure: true,
      maxAge: data.expires_in,
      path: '/',
    });
    
    return response;

 } catch (error) {
  console.error('Callback error:', error);  // <-- Maintenant utilisé
  return NextResponse.redirect(
    new URL(`/?error=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`, request.url)
  );
}
}