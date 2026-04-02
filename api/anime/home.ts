import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

const api = axios.create({
  baseURL: "https://www.sankavollerei.com",
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    Accept: "application/json, text/html, */*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
    Referer: "https://www.sankavollerei.com",
  },
  timeout: 20000,
  decompress: true,
});

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (_req.method === "OPTIONS") return res.status(200).end();

  try {
    const { data } = await api.get("/anime/home");
    const list: Record<string, unknown>[] = data?.data?.ongoing?.animeList || [];
    const mapped = list.map((a) => ({
      title: a.title,
      slug: a.animeId,
      poster: a.poster,
      episode: a.episodes ? `Ep ${a.episodes}` : "",
      releaseDay: a.releaseDay,
      latestReleaseDate: a.latestReleaseDate,
      href: a.href,
      type: "TV",
    }));
    return res.status(200).json(mapped);
  } catch (err) {
    console.error("home error:", err);
    return res.status(500).json({ error: "Failed to fetch home" });
  }
}
