# 🎬 XioNime - Nonton Anime Sub Indo

> Streaming anime sub indo gratis, update otomatis setiap hari.

## 🌐 Website

**[https://xionime.vercel.app](https://xionime.vercel.app)**

---

## ✨ Fitur

- **Beranda** — Episode terbaru & anime populer
- **Jadwal** — Jadwal rilis anime mingguan
- **Tonton** — Streaming multi-server & multi-kualitas (360p hingga 4K)
- **Cari** — Cari anime berdasarkan judul atau genre
- **Admin** — Panel admin untuk manajemen iklan

## 📺 Server Streaming

| Server | Kualitas |
|--------|----------|
| Wibufile | 480p · 720p · 1080p |
| Mega | 480p · 720p · 1080p · 4K |
| Pucuk | 480p · 720p · 1080p |
| Blogspot | 360p |

## 🔗 API Endpoints

| Endpoint | Deskripsi |
|----------|-----------|
| `GET /api/anime/home` | Episode terbaru & ongoing |
| `GET /api/anime/recent` | Episode paling baru |
| `GET /api/anime/schedule` | Jadwal rilis mingguan |
| `GET /api/anime/search?q=...` | Cari anime |
| `GET /api/anime/ongoing` | Anime sedang tayang |
| `GET /api/anime/completed` | Anime selesai |
| `GET /api/anime/popular` | Anime populer |
| `GET /api/anime/movies` | Film anime |
| `GET /api/anime/genres` | Daftar genre |
| `GET /api/anime/detail/:id` | Detail anime |
| `GET /api/anime/episode/:id` | Detail episode + daftar server |
| `GET /api/anime/server/:id` | URL streaming langsung |

## 🛠 Deploy ke Vercel

1. Fork repo ini
2. Import di [vercel.com](https://vercel.com)
3. Pilih **Framework Preset**: Other
4. Konfigurasi sudah otomatis dari `vercel.json`
5. Klik **Deploy**

## 🔄 Auto Update

Data episode diperbarui otomatis setiap hari tengah malam via Vercel Cron Jobs.

## 🛡 Admin Panel

Akses di `/admin` — Password default: `cipung`

## 💻 Teknologi

- **Frontend**: React 19 + Vite + TailwindCSS v4
- **API**: Vercel Serverless Functions
- **Routing**: Wouter
- **State**: TanStack Query
- **Sumber data**: [sankavollerei.com](https://www.sankavollerei.com/anime/samehadaku)

---

*Made with ❤️ for anime lovers*
