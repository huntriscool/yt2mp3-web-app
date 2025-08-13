const express = require('express');
const ytdl = require('@distube/ytdl-core');
const cors = require('cors');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// FFmpeg check
function checkFFmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch (err) {
    return false;
  }
}

app.get('/download', async (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL || !ytdl.validateURL(videoURL)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  if (!checkFFmpeg()) {
    return res.status(500).json({ error: 'FFmpeg is not installed or not in PATH' });
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    if (info.videoDetails.isPrivate) {
      return res.status(403).json({ error: 'Video is private' });
    }
    if (info.videoDetails.age_restricted) {
      return res.status(403).json({ error: 'Video is age-restricted' });
    }

    const title = info.videoDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);

    const stream = ytdl(videoURL, { filter: 'audioonly' });
    const ffmpeg = require('fluent-ffmpeg');

    ffmpeg(stream)
      .audioBitrate(128)
      .toFormat('mp3')
      .on('error', err => {
        console.error('FFmpeg error:', err.message);
        res.status(500).json({ error: 'Error processing video: ' + err.message });
      })
      .pipe(res);

  } catch (err) {
    console.error('Processing error:', err);
    res.status(500).json({ error: 'Failed to process video: ' + err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
