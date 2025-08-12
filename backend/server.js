import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(express.json());

const DOWNLOAD_DIR = path.resolve('downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);

app.post('/api/download', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'No URL provided' });

  // Unique file names to prevent clashes
  const uniqueId = Date.now();
  const outputTemplate = path.join(DOWNLOAD_DIR, `audio-${uniqueId}.%(ext)s`);

  // yt-dlp downloads & converts to mp3 with -x --audio-format mp3 flags
  const cmd = `yt-dlp -x --audio-format mp3 -o "${outputTemplate}" ${url}`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error('Download error:', error);
      return res.status(500).json({ error: 'Failed to download video/audio' });
    }

    // mp3 file path
    const mp3Path = path.join(DOWNLOAD_DIR, `audio-${uniqueId}.mp3`);

    if (!fs.existsSync(mp3Path)) {
      console.error('MP3 not found:', mp3Path);
      return res.status(500).json({ error: 'MP3 file not found after conversion' });
    }

    res.download(mp3Path, 'youtube-audio.mp3', (err) => {
      if (err) console.error('Sending file error:', err);
      // Delete file after sending
      fs.unlink(mp3Path, (err) => {
        if (err) console.error('Failed to delete file:', err);
      });
    });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
