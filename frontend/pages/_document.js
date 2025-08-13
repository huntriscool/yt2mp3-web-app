import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Convert YouTube videos to high-quality MP3 files instantly. Fast, free, and secure YouTube to MP3 converter." />
        <meta name="keywords" content="youtube to mp3, youtube converter, mp3 download, video to audio" />
        <meta name="author" content="YouTube MP3 Converter" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="YouTube to MP3 Converter - Fast & Free" />
        <meta property="og:description" content="Convert YouTube videos to high-quality MP3 files instantly. No registration required." />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="YouTube to MP3 Converter - Fast & Free" />
        <meta property="twitter:description" content="Convert YouTube videos to high-quality MP3 files instantly. No registration required." />
        <meta property="twitter:image" content="/og-image.png" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#6366f1" />
        <meta name="msapplication-TileColor" content="#6366f1" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}