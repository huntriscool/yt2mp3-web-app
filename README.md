# Minimal YouTube to MP3 Web App

## Requirements
- Node.js v22.18.0+
- npm v11.5.2+
- Python 3.13.5+
- yt-dlp installed: `pip install yt-dlp`
- ffmpeg installed and in your system PATH

---

## Setup & Run

### Backend

```bash
cd backend
npm install
node server.js
```

Runs on http://localhost:3001

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:3000

---

### Usage

- Open frontend in browser
- Paste YouTube URL
- Click "Download MP3"
- MP3 file downloads after conversion

---

## Notes

- Backend saves files temporarily in `backend/downloads/`
- Files are deleted after download to keep things clean
- For production, add error handling, input validation, and security!
