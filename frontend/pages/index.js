import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!url) return alert('Please enter a YouTube URL');
    setDownloading(true);
    window.location.href = `http://localhost:4000/download?url=${encodeURIComponent(url)}`;
    setTimeout(() => setDownloading(false), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass p-8 max-w-md w-full shadow-xl text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">YouTube → MP3</h1>
        <input
          type="text"
          placeholder="Enter YouTube video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 rounded mb-4 text-black"
        />
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full bg-green-700 hover:bg-green-800 p-3 rounded transition"
        >
          {downloading ? 'Downloading...' : 'Download MP3'}
        </button>
      </div>
    </div>
  );
}
