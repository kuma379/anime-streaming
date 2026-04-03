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
  timeout: 8000,
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
    } catch {
      return res.status(500).json({ error: "Gagal memuat genre" });
    }
  }

  // Search mode - fetch key genres in parallel with reasonable page depth
  if (query) {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=180");
    
    // Key genres for popular anime coverage
    const SEARCH_PLAN = [
      { genre: "shounen", pages: 30 },    // One Piece, Bleach, Naruto, Jujutsu etc.
      { genre: "action", pages: 20 },     // Kimetsu, AoT, etc.
      { genre: "adventure", pages: 15 },
      { genre: "fantasy", pages: 12 },
      { genre: "supernatural", pages: 10 },
      { genre: "comedy", pages: 10 },
      { genre: "romance", pages: 10 },
      { genre: "drama", pages: 8 },
      { genre: "magic", pages: 8 },
      { genre: "sci-fi", pages: 8 },
      { genre: "school", pages: 8 },
      { genre: "mystery", pages: 6 },
      { genre: "horror", pages: 5 },
      { genre: "sports", pages: 8 },
      { genre: "mecha", pages: 6 },
      { genre: "historical", pages: 6 },
      { genre: "slice-of-life", pages: 6 },
      { genre: "psychological", pages: 5 },
      { genre: "super-power", pages: 8 },
      { genre: "martial-arts", pages: 6 },
      { genre: "military", pages: 5 },
      { genre: "vampire", pages: 4 },
      { genre: "harem", pages: 6 },
    ];

    const requests: Promise<AnimeEntry[]>[] = [];
    for (const plan of SEARCH_PLAN) {
      for (let p = 1; p <= plan.pages; p++) {
        requests.push(fetchPage(plan.genre, p));
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
