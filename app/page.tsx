export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Connecte-toi à Spotify</h1>
      <a href="/api/login">
        <button>Se connecter</button>
      </a>
    </div>
  );
}
