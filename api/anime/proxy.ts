import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const targetUrl = req.query.url as string;
  if (!targetUrl) return res.status(400).send("Missing url param");

  try {
    const upstream = await axios.get(targetUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,*/*",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: "https://www.sankavollerei.com/",
        Origin: "https://www.sankavollerei.com",
      },
      timeout: 20000,
      decompress: true,
    });

    // Strip headers that block iframe embedding
    res.removeHeader("X-Frame-Options");
    res.removeHeader("Content-Security-Policy");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Content-Type",
      upstream.headers["content-type"] || "text/html; charset=utf-8"
    );

    return res.status(upstream.status).send(upstream.data);
  } catch (err) {
    console.error("proxy error:", err);
    return res.status(502).send("Proxy error");
  }
}
