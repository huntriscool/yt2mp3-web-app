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
  const quality = req.query.quality || 'medium'; // default to medium
  
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

    // Set quality based on user selection
    let audioBitrate;
    switch(quality) {
      case 'low':
        audioBitrate = 96;
        break;
      case 'high':
        audioBitrate = 320;
        break;
      case 'medium':
      default:
        audioBitrate = 128;
        break;
    }

    const stream = ytdl(videoURL, { filter: 'audioonly', quality: 'highestaudio' });
    const ffmpeg = require('fluent-ffmpeg');

    ffmpeg(stream)
      .audioBitrate(audioBitrate)
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

// New endpoint to get video info for preview
app.get('/video-info', async (req, res) => {
  const videoURL = req.query.url;
  
  if (!videoURL || !ytdl.validateURL(videoURL)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    const videoDetails = info.videoDetails;
    
    res.json({
      title: videoDetails.title,
      author: videoDetails.author.name,
      lengthSeconds: videoDetails.lengthSeconds,
      viewCount: videoDetails.viewCount,
      thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url,
      description: videoDetails.shortDescription?.substring(0, 200) + '...' || 'No description available'
    });
  } catch (err) {
    console.error('Error fetching video info:', err);
    res.status(500).json({ error: 'Failed to fetch video information' });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
