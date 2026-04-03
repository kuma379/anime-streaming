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
  validateStatus: () => true,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const slug = req.query.slug as string;
  if (!slug) return res.status(400).json({ error: "Missing slug" });

  try {
    const { data, status } = await api.get(`/anime/episode/${slug}`);
    if (status !== 200 || !data?.data) return res.status(404).json({ error: "Episode tidak ditemukan" });
    const d = data.data;

    const qualities: Record<string, unknown>[] = d?.server?.qualities || [];
    const servers: { name: string; serverId: string; quality: string }[] = [];
    for (const q of qualities) {
      const qTitle = q.title as string;
      const serverList = (q.serverList as Record<string, unknown>[]) || [];
      for (const s of serverList) {
        servers.push({ name: String(s.title).trim(), serverId: s.serverId as string, quality: qTitle });
      }
    }

    const mapNav = (nav: Record<string, unknown> | null | undefined) =>
      nav ? { title: nav.title || "", episodeId: nav.episodeId || "", href: nav.href || "" } : null;

    return res.status(200).json({
      title: d?.title || slug.replace(/-/g, " "),
      animeId: d?.animeId || "",
      defaultStreamingUrl: d?.defaultStreamingUrl || "",
      releaseTime: d?.releaseTime || "",
      prevEpisode: mapNav(d?.prevEpisode as Record<string, unknown>),
      nextEpisode: mapNav(d?.nextEpisode as Record<string, unknown>),
      servers,
      synopsis: d?.info?.synopsis || "",
      poster: d?.info?.poster || "",
      anime: d?.animeId || "",
    });
  } catch (err) {
    console.error("episode error:", err);
    return res.status(500).json({ error: "Failed to fetch episode" });
  }
}
