import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

const api = axios.create({
  baseURL: "https://www.sankavollerei.com",
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept: "application/json, text/html, */*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
    Referer: "https://www.sankavollerei.com/",
    Origin: "https://www.sankavollerei.com",
  },
  timeout: 25000,
  decompress: true,
  validateStatus: () => true,
});

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  if (_req.method === "OPTIONS") return res.status(200).end();

  try {
    const { data } = await api.get("/anime/schedule");
    const rawDays: Record<string, unknown>[] = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];
    const mapped = rawDays.map((d) => ({
      day: d.day,
      animes: (
        (d.animeList as Record<string, unknown>[]) ||
        (d.anime_list as Record<string, unknown>[]) ||
        []
      ).map((a) => ({
        title: a.title,
        slug: a.animeId || a.slug,
        poster: a.poster,
        href: a.href || a.url,
        episode: a.latestEps ? `Ep ${a.latestEps}` : "",
      })),
    }));
    return res.status(200).json(mapped);
  } catch (err) {
    console.error("schedule error:", err);
    return res.status(500).json({ error: "Gagal mengambil jadwal." });
  }
}
