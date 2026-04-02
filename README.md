# Anime Streaming

Aplikasi streaming anime berbahasa Indonesia dengan panel admin untuk manajemen iklan.

## Fitur

- **Beranda** - Daftar episode terbaru dan anime populer
- **Jadwal** - Jadwal rilis anime mingguan
- **Tonton** - Halaman streaming dengan multi-server dan multi-kualitas
- **Admin** - Panel admin untuk memasang dan menghapus iklan

## API Endpoints

| Endpoint | Deskripsi |
|---|---|
| `GET /api/anime/home` | Daftar anime ongoing terbaru |
| `GET /api/anime/schedule` | Jadwal rilis mingguan |
| `GET /api/anime/episode/:slug` | Detail episode + daftar server |
| `GET /api/anime/server/:id` | URL stream dari server |
| `GET /api/anime/winbu/server` | URL stream winbu |
| `GET /api/anime/proxy?url=` | Proxy URL streaming |

## Admin Panel

Akses admin di `/admin`

- **Password default:** `cipung`
- Tambah iklan (banner/skrip) di berbagai posisi halaman
- Hapus iklan yang sudah tidak digunakan

## Deploy ke Vercel

1. Import repo ini ke [vercel.com](https://vercel.com)
2. Pilih **Framework Preset**: Other
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist/public`
5. **Install Command**: `npm install`
6. Klik **Deploy**

> Konfigurasi sudah ada di `vercel.json`, tidak perlu pengaturan tambahan.

## Teknologi

- **Frontend**: React 19 + Vite + TailwindCSS
- **API**: Vercel Serverless Functions + Axios
- **Data Source**: [sankavollerei.com](https://www.sankavollerei.com)
- **State**: TanStack Query
- **Routing**: Wouter
