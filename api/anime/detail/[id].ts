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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");
  if (req.method === "OPTIONS") return res.status(200).end();

  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: "Missing anime id" });

  try {
    const { data, status } = await api.get(`/anime/anime/${id}`);
    if (status !== 200 || !data?.data) {
      return res.status(404).json({ error: "Anime tidak ditemukan" });
    }
    const d = data.data;

    let synopsis = "";
    if (typeof d.synopsis === "string") {
      synopsis = d.synopsis;
    } else if (d.synopsis && typeof d.synopsis === "object") {
      const synObj = d.synopsis as Record<string, unknown>;
      const paras = Array.isArray(synObj.paragraphs) ? synObj.paragraphs as string[] : [];
      synopsis = paras.join(" ").trim();
    }

    const genreList = ((d.genreList as Record<string, unknown>[]) || []).map((g) => ({
      title: g.title,
      slug: g.genreId || g.slug || "",
    }));

    const episodeList = ((d.episodeList as Record<string, unknown>[]) || []).map((ep) => ({
      title: ep.title,
      eps: ep.eps,
      date: ep.date,
      episodeId: ep.episodeId,
      href: ep.href,
    }));

    return res.status(200).json({
      title: d.title,
      poster: d.poster,
      japanese: d.japanese,
      score: d.score,
      producers: d.producers,
      type: d.type,
      status: d.status,
      episodes: d.episodes,
      duration: d.duration,
      aired: d.aired,
      studios: d.studios,
      synopsis,
      genreList,
      episodeList,
    });
  } catch (err) {
    console.error("detail error:", err);
    return res.status(500).json({ error: "Gagal mengambil detail anime." });
  }
}
