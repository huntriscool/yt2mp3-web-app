import { useState, useEffect } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [quality, setQuality] = useState('medium');
  const [videoInfo, setVideoInfo] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Debounced video preview fetch
  useEffect(() => {
    if (!url.trim()) {
      setVideoInfo(null);
      setPreviewError('');
      return;
    }

    setLoadingPreview(true);
    setPreviewError('');

    const timeoutId = setTimeout(() => {
      fetchVideoPreview(url);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [url]);

  const fetchVideoPreview = async (videoUrl) => {
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

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count?.toString() || '0';
  };

  const handleDownload = async () => {
    if (!url) return alert('Please enter a YouTube URL');
    setDownloading(true);
    setDownloadProgress(0);

    // Smooth progress simulation
    const progressInterval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 99) {
          clearInterval(progressInterval);
          return 99;
        }
        return prev + Math.random() * 5; // slower increments
      });
    }, 150);

    window.location.href = `http://localhost:4000/download?url=${encodeURIComponent(url)}&quality=${quality}`;

    setTimeout(() => {
      clearInterval(progressInterval);
      setDownloadProgress(100);
      setTimeout(() => {
        setDownloading(false);
        setDownloadProgress(0);
      }, 2000);
    }, 3500);
  };

  const qualityOptions = [
    { value: 'low', label: 'Standard', bitrate: '96kbps', desc: 'Smaller file size', icon: '📱' },
    { value: 'medium', label: 'High', bitrate: '128kbps', desc: 'Balanced quality', icon: '🎵' },
    { value: 'high', label: 'Premium', bitrate: '320kbps', desc: 'Best quality', icon: '🎧' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">YT</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">YouTube Converter</h1>
              <p className="text-gray-400 text-sm">Fast & Free MP3 Downloads</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Online</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="glass p-8 max-w-2xl w-full shadow-2xl text-white fade-in mt-20">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
            YouTube to MP3
          </h2>
          <p className="text-gray-300 text-lg">Convert YouTube videos to high-quality MP3 files instantly</p>
        </div>

        {/* URL Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">YouTube Video URL</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Paste your YouTube video link here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input-glass w-full p-4 text-white placeholder-gray-400 focus-ring"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              {loadingPreview && <div className="loading-spinner"></div>}
              {videoInfo && !loadingPreview && (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loadingPreview && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center space-x-3 text-indigo-300">
              <div className="loading-spinner"></div>
              <span className="text-sm">Analyzing video...</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {previewError && (
          <div className="mb-6 p-4 error-message fade-in">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-red-200 text-sm">{previewError}</span>
            </div>
          </div>
        )}

        {/* Video Preview */}
        {videoInfo && (
          <div className="mb-8 video-preview p-6 fade-in">
            <div className="flex gap-4">
              <div className="relative flex-shrink-0">
                <img src={videoInfo.thumbnail} alt="Video thumbnail" className="w-32 h-24 object-cover rounded-xl shadow-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 leading-tight text-white">{videoInfo.title}</h3>
                <p className="text-sm text-gray-300 mb-3">{videoInfo.author}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <span>{formatDuration(videoInfo.lengthSeconds)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{formatViewCount(videoInfo.viewCount)} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quality Selection */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-white mb-4">Choose Audio Quality</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 quality-grid">
            {qualityOptions.map((option) => (
              <label key={option.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="quality"
                  value={option.value}
                  checked={quality === option.value}
                  onChange={(e) => setQuality(e.target.value)}
                  className="sr-only"
                />
                <div className={`quality-option p-4 text-center relative ${quality === option.value ? 'selected' : ''}`}>
                  <div className="relative z-10">
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-semibold text-white mb-1">{option.label}</div>
                    <div className="text-sm text-gray-300 mb-1">{option.bitrate}</div>
                    <div className="text-xs text-gray-400">{option.desc}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Download Button */}
        <div className="space-y-4">
          <button
            onClick={handleDownload}
            disabled={downloading || !videoInfo}
            className={`btn-primary w-full p-4 text-white font-semibold text-lg relative overflow-hidden ${
              downloading || !videoInfo ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="relative z-10 flex items-center justify-center space-x-3">
              {downloading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <span>Download MP3</span>
                </>
              )}
            </div>
          </button>

          {/* Download Progress */}
          {downloading && downloadProgress > 0 && (
            <div className="fade-in">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Converting to MP3...</span>
                <span>{Math.round(downloadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
