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
    "X-Requested-With": "XMLHttpRequest",
  },
  timeout: 20000,
  decompress: true,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { post, nume = "1", type = "schtml" } = req.query as Record<string, string>;
  if (!post) return res.status(400).json({ error: "Missing post parameter" });

  try {
    const { data } = await api.get("/anime/winbu/server", {
      params: { post, nume, type },
    });
    const url = data?.embed_url || data?.data?.embed_url || data?.url || "";
    return res.status(200).json({ url });
  } catch (err) {
    console.error("winbu error:", err);
    return res.status(500).json({ error: "Failed to fetch winbu server" });
  }
}
