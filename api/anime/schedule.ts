import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as cheerio from "cheerio";

const SOURCE = "https://www.sankavollerei.com/anime/schedule";

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
    const schedule: object[] = [];

    $(".jadwal-day, .schedule-day, [class*='day']").each((_, dayEl) => {
      const $day = $(dayEl);
      const day = $day.find(".day-name, h3, h2").first().text().trim();
      if (!day) return;

      const animes: object[] = [];
      $day.find("article, li, .anime-item").each((_, animeEl) => {
        const $a = $(animeEl);
        const title = $a.find(".title, h3, h4, a").first().text().trim();
        const link = $a.find("a").first().attr("href") || "";
        const slug = link.split("/").filter(Boolean).pop() || "";
        const poster = $a.find("img").first().attr("src") || $a.find("img").first().attr("data-src") || "";
        const episode = $a.find(".episode, .ep").first().text().trim();
        if (title) animes.push({ title, slug, poster, episode, type: "TV" });
      });

      if (animes.length > 0) {
        schedule.push({ day, animes });
      }
    });

    return res.status(200).json(schedule);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch" });
  }
}
