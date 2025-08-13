import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [quality, setQuality] = useState('medium');
  const [videoInfo, setVideoInfo] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState('');

  const fetchVideoPreview = async (videoUrl) => {
    if (!videoUrl.trim()) {
      setVideoInfo(null);
      return;
    }

    setLoadingPreview(true);
    setPreviewError('');
    
    try {
      const response = await fetch(`http://localhost:4000/video-info?url=${encodeURIComponent(videoUrl)}`);
      const data = await response.json();
      
      if (response.ok) {
        setVideoInfo(data);
      } else {
        setPreviewError(data.error || 'Failed to load video preview');
        setVideoInfo(null);
      }
    } catch (error) {
      setPreviewError('Failed to load video preview');
      setVideoInfo(null);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    // Debounce the preview fetch
    const timeoutId = setTimeout(() => {
      fetchVideoPreview(newUrl);
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count?.toString() || '0';
  };

  const handleDownload = async () => {
    if (!url) return alert('Please enter a YouTube URL');
    setDownloading(true);
    window.location.href = `http://localhost:4000/download?url=${encodeURIComponent(url)}&quality=${quality}`;
    setTimeout(() => setDownloading(false), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass p-8 max-w-lg w-full shadow-xl text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">YouTube → MP3</h1>
        
        <input
          type="text"
          placeholder="Enter YouTube video URL"
          value={url}
          onChange={handleUrlChange}
          className="w-full p-3 rounded mb-4 text-black"
        />
        
        {/* Loading indicator */}
        {loadingPreview && (
          <div className="mb-4 text-center text-blue-300">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Loading preview...
          </div>
        )}
        
        {/* Error message */}
        {previewError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
            {previewError}
          </div>
        )}
        
        {/* Video Preview */}
        {videoInfo && (
          <div className="mb-6 p-4 bg-white/10 rounded-lg border border-white/20">
            <div className="flex gap-4">
              <img 
                src={videoInfo.thumbnail} 
                alt="Video thumbnail"
                className="w-24 h-18 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2 leading-tight">
                  {videoInfo.title}
                </h3>
                <p className="text-xs text-gray-300 mb-1">{videoInfo.author}</p>
                <div className="flex gap-3 text-xs text-gray-400">
                  <span>{formatDuration(videoInfo.lengthSeconds)}</span>
                  <span>{formatViewCount(videoInfo.viewCount)} views</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Quality Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Audio Quality</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'low', label: 'Low (96kbps)', desc: 'Smaller file' },
              { value: 'medium', label: 'Medium (128kbps)', desc: 'Balanced' },
              { value: 'high', label: 'High (320kbps)', desc: 'Best quality' }
            ].map((option) => (
              <label key={option.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="quality"
                  value={option.value}
                  checked={quality === option.value}
                  onChange={(e) => setQuality(e.target.value)}
                  className="sr-only"
                />
                <div className={`p-3 rounded-lg border-2 transition-all text-center ${
                  quality === option.value 
                    ? 'border-green-400 bg-green-400/20' 
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}>
                  <div className="text-sm font-medium">{option.label.split(' ')[0]}</div>
                  <div className="text-xs text-gray-300 mt-1">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
        
        <button
          onClick={handleDownload}
          disabled={downloading || !videoInfo}
          className={`w-full p-3 rounded transition font-medium ${
            downloading || !videoInfo
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-green-700 hover:bg-green-800'
          }`}
        >
          {downloading ? 'Downloading...' : 'Download MP3'}
        </button>
        
        {!videoInfo && url && !loadingPreview && !previewError && (
          <p className="text-xs text-gray-400 text-center mt-2">
            Enter a valid YouTube URL to enable download
          </p>
        )}
      </div>
    </div>
  );
}
