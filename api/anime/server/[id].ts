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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: "Missing server id" });

  try {
    const { data } = await api.get(`/anime/server/${id}`);
    const url = data?.data?.url || data?.url || "";
    return res.status(200).json({ url });
  } catch (err) {
    console.error("server error:", err);
    return res.status(500).json({ error: "Failed to fetch server" });
  }
}
