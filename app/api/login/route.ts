// login.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const scope = [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'playlist-read-private',
    'user-top-read'
  ].join(' ');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    show_dialog: 'true', // Force à montrer le dialogue à chaque fois
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params}`);
}