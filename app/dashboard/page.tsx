// app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SpotifyWebApi from 'spotify-web-api-node';

export default async function Dashboard() {
  // Correction: await pour obtenir le cookieStore
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token')?.value;

  if (!accessToken) {
    redirect('/');
  }

  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    const [user, topTracks] = await Promise.all([
      spotifyApi.getMe(),
      spotifyApi.getMyTopTracks({ limit: 5 })
    ]);

    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Bienvenue, {user.body.display_name || user.body.id}!
        </h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Vos morceaux préférés</h2>
          <div className="grid gap-4">
            {topTracks.body.items.map((track) => (
              <div key={track.id} className="flex items-center p-4 bg-gray-800 rounded-lg">
                <img 
                  src={track.album.images[0]?.url} 
                  alt={track.name}
                  className="w-16 h-16 rounded mr-4"
                />
                <div>
                  <h3 className="font-medium">{track.name}</h3>
                  <p className="text-gray-400">
                    {track.artists.map(a => a.name).join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch Spotify data:', error);
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Erreur lors de la récupération des données Spotify.</p>
      </div>
    );
  }
}