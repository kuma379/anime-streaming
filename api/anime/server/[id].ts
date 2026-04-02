import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: "Missing server id" });

  const url = `https://www.sankavollerei.com/anime/server/${id}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/json,*/*",
        Referer: "https://www.sankavollerei.com/",
      },
    });

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();
      return res.status(200).json({ url: data.url || data.embed || data.source || url, type: "embed" });
    }

    const text = await response.text();
    const iframeMatch = text.match(/src=["']([^"']+)["']/);
    const videoMatch = text.match(/https?:\/\/[^\s"'<>]+\.(mp4|m3u8)[^\s"'<>]*/i);

    const videoUrl = iframeMatch?.[1] || videoMatch?.[0] || url;
    return res.status(200).json({ url: videoUrl, type: "embed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch server" });
  }
}
