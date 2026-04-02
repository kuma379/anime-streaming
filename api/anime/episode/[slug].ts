import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as cheerio from "cheerio";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const slug = req.query.slug as string;
  if (!slug) return res.status(400).json({ error: "Missing slug" });

  const url = `https://www.sankavollerei.com/anime/episode/${slug}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $("h1, .entry-title, .post-title").first().text().trim();
    const synopsis = $(".synopsis, .sinopsis p, .desc p").first().text().trim();
    const poster = $(".thumb img, .poster img").first().attr("src") || "";
    const anime = $(".anime-title, .breadcrumb a").last().text().trim();

    const servers: object[] = [];
    $(".mirror a, .server a, .serverul li").each((_, el) => {
      const $el = $(el);
      const name = $el.text().trim();
      const href = $el.attr("href") || $el.attr("data-server") || $el.attr("data-id") || "";
      const serverId = href.split("/").filter(Boolean).pop() || href;
      if (name) servers.push({ name, serverId });
    });

    return res.status(200).json({ title, synopsis, poster, anime, servers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch episode" });
  }
}
