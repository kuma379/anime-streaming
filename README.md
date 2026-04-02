# AniStream - Website Streaming Anime Sub Indonesia

Website streaming anime sub Indonesia yang dapat di-deploy di Vercel.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend API**: Vercel Serverless Functions (proxy ke sankavollerei.com)
- **Deployment**: Vercel

## API Endpoints
- `/api/anime/home` - Daftar anime terbaru
- `/api/anime/schedule` - Jadwal tayang
- `/api/anime/episode/:slug` - Detail episode
- `/api/anime/server/:id` - Server video
- `/api/anime/winbu/server?post=...&nume=...&type=...` - Winbu server

## Deploy ke Vercel

1. Fork repository ini
2. Login ke [Vercel](https://vercel.com)
3. Import repository dari GitHub
4. Vercel akan auto-detect konfigurasi dari `vercel.json`
5. Deploy!

## Fitur
- 🎬 Halaman utama dengan hero & daftar anime
- 📅 Jadwal tayang mingguan
- 📺 Video player dengan multi-server
- 🌙 Dark theme anime-style
- 📱 Responsive untuk mobile & desktop

## Source API
Semua data diambil dari [sankavollerei.com](https://www.sankavollerei.com)
