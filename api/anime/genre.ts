import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

const api = axios.create({
  baseURL: "https://www.sankavollerei.com",
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept: "application/json, text/html, */*",
    "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
    Referer: "https://www.sankavollerei.com/",
    Origin: "https://www.sankavollerei.com",
  },
  timeout: 10000,
  decompress: true,
});

type AnimeEntry = {
  title: string;
  animeId: string;
  poster: string;
  score: string;
  episodes: number | null;
  studios: string;
  season: string;
};

function mapEntry(a: AnimeEntry) {
  return {
    title: a.title,
    slug: a.animeId,
    poster: a.poster,
    score: a.score || "",
    episodes: a.episodes ?? null,
    studios: a.studios || "",
    season: a.season || "",
  };
}

async function fetchPage(genre: string, page: number): Promise<AnimeEntry[]> {
  try {
    const { data } = await api.get(`/anime/genre/${genre}?page=${page}`);
    return (data?.data?.animeList || []) as AnimeEntry[];
  } catch {
    return [];
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const query = ((req.query.q as string) || "").toLowerCase().trim();
  const genre = (req.query.genre as string) || "";
  const page = Math.max(1, parseInt((req.query.page as string) || "1", 10));

  // Genre browse mode
  if (!query && genre) {
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    try {
      const items = await fetchPage(genre, page);
      return res.status(200).json(items.map(mapEntry));
    } catch (err) {
      return res.status(500).json({ error: "Gagal memuat genre" });
    }
  }

  // Search mode
  if (query) {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=180");
    const GENRES = ["shounen", "action", "adventure", "fantasy", "supernatural", "comedy", "romance", "drama", "sci-fi", "mystery", "sports", "mecha", "historical", "magic", "super-power", "martial-arts", "psychological", "school", "slice-of-life", "military", "horror", "thriller", "vampire", "harem", "ecchi", "game"];
    const MAX_PAGES = 15;

    const requests: Promise<AnimeEntry[]>[] = [];
    for (const g of GENRES) {
      for (let p = 1; p <= MAX_PAGES; p++) {
        requests.push(fetchPage(g, p));
      }
    }

    const results = await Promise.all(requests);
    const flat = results.flat();

    const seen = new Set<string>();
    const unique = flat.filter((a) => {
      if (!a.animeId || seen.has(a.animeId)) return false;
      seen.add(a.animeId);
      return true;
    });

    const filtered = unique.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.animeId.toLowerCase().replace(/-sub-indo$/i, "").includes(query.replace(/\s+/g, "-"))
    );

    return res.status(200).json(filtered.slice(0, 30).map(mapEntry));
  }

  return res.status(400).json({ error: "Provide ?genre= or ?q=" });
}
