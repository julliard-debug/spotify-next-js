// page.tsx
import React from 'react';
import '@/app/globals.css'; // Assurez-vous que ce fichier contient les styles nécessaires
import { Metadata } from 'next';
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-black to-[#121212]">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-white">
          Connecte-toi à <span className="text-[#1DB954]">Spotify</span>
        </h1>
        <p className="mb-8 text-gray-300">
          Accède à tes playlists, artistes préférés et découvre de nouvelles musiques.
        </p>
        <a href="/api/login" className="inline-block">
          <button className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 pulse">
            Se connecter avec Spotify
          </button>
        </a>
      </div>
    </div>
  );
}