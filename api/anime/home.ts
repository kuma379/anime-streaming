import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as cheerio from "cheerio";

const SOURCE = "https://www.sankavollerei.com/anime/home";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (_req.method === "OPTIONS") return res.status(200).end();

  try {
    const response = await fetch(SOURCE, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    const animes: object[] = [];

    $(".latest-updates .list-episode article, .listupd article, .animepost").each((_, el) => {
      const $el = $(el);
      const titleEl = $el.find(".title, h2, h3, .name").first();
      const title = titleEl.text().trim();
      const link = $el.find("a").first().attr("href") || "";
      const slug = link.split("/").filter(Boolean).pop() || "";
      const poster = $el.find("img").first().attr("src") || $el.find("img").first().attr("data-src") || "";
      const episode = $el.find(".episode, .ep, .epxs").first().text().trim();
      const type = $el.find(".type, .typeseries").first().text().trim();

      if (title) {
        animes.push({ title, slug, poster, episode, type });
      }
    });

    if (animes.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(animes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch" });
  }
}
