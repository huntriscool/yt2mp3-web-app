# YouTube to MP3 Converter

A modern, professional web application for converting YouTube videos to high-quality MP3 files. Built with Next.js and Node.js.

## Features

- 🎵 **High-Quality Audio**: Convert videos to MP3 with multiple quality options (96kbps, 128kbps, 320kbps)
- ⚡ **Lightning Fast**: Instant video preview and quick conversion
- 🔒 **Secure & Private**: No registration required, no data stored
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Beautiful glassmorphism design with smooth animations
- 🔍 **Video Preview**: See video details before downloading
- 📊 **Progress Tracking**: Real-time download progress indicator

## Tech Stack

### Frontend
- **Next.js 14** - React framework for production
- **Tailwind CSS** - Utility-first CSS framework
- **Inter Font** - Modern typography
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **@distube/ytdl-core** - YouTube video downloader
- **fluent-ffmpeg** - Audio processing
- **CORS** - Cross-origin resource sharing

## Prerequisites

- Node.js 16+ installed
- FFmpeg installed on your system

### Installing FFmpeg

**Windows:**
1. Download from [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
2. Extract and add to PATH

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

## Installation & Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd youtube-mp3-converter
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Start the backend server**
```bash
cd ../backend
npm start
```
The backend will run on `http://localhost:4000`

5. **Start the frontend development server**
```bash
cd ../frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

## Production Deployment

### Frontend (Vercel/Netlify)

1. **Build the frontend**
```bash
cd frontend
npm run build
```

2. **Deploy to Vercel**
```bash
npm install -g vercel
vercel --prod
```

### Backend (Railway/Heroku/DigitalOcean)

1. **Ensure FFmpeg is available in production environment**
2. **Set environment variables if needed**
3. **Deploy using your preferred platform**

### Environment Variables

Create a `.env.local` file in the frontend directory for production:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## API Endpoints

### GET `/video-info`
Get video information for preview
- **Query Parameters**: `url` (YouTube video URL)
- **Response**: Video title, author, duration, view count, thumbnail

### GET `/download`
Download video as MP3
- **Query Parameters**: 
  - `url` (YouTube video URL)
  - `quality` (low|medium|high)
- **Response**: MP3 file download

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Optimizations

- **Image Optimization**: Next.js automatic image optimization
- **Font Loading**: Optimized Google Fonts loading
- **Code Splitting**: Automatic code splitting with Next.js
- **Caching**: Browser caching for static assets
- **Compression**: Gzip compression for all assets

## Security Features

- **CORS Protection**: Configured for secure cross-origin requests
- **XSS Protection**: Content Security Policy headers
- **Input Validation**: URL validation and sanitization
- **No Data Storage**: No user data or videos stored on server

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This tool is for educational purposes only. Please respect YouTube's Terms of Service and copyright laws. Only download content you have permission to use.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Made with ❤️ for the developer community**