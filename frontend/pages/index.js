import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const downloadMp3 = async () => {
    if (!url) {
      alert('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Download failed');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'youtube-audio.mp3';
      link.click();

    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        maxWidth: 400,
        margin: '4rem auto',
        padding: 20,
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
      }}
    >
      <h1 style={{ marginBottom: 24 }}>YouTube to MP3</h1>
      <input
        type="text"
        placeholder="Paste YouTube link here"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 10px',
          fontSize: 16,
          borderRadius: 6,
          border: '1px solid #ccc',
        }}
        disabled={loading}
      />
      <button
        onClick={downloadMp3}
        disabled={loading}
        style={{
          marginTop: 20,
          padding: '12px 20px',
          fontSize: 16,
          cursor: loading ? 'not-allowed' : 'pointer',
          borderRadius: 6,
          border: 'none',
          backgroundColor: '#0070f3',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        {loading ? 'Downloading...' : 'Download MP3'}
      </button>
    </main>
  );
}
