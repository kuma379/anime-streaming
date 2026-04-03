const BASE = "https://www.sankavollerei.com/anime/samehadaku";

const UPSTREAM_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  "Accept": "application/json, text/html, */*",
  "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
  "Referer": "https://www.sankavollerei.com/",
  "Origin": "https://www.sankavollerei.com",
};

async function fetchAPI(path) {
  const res = await fetch(`${BASE}${path}`, { headers: UPSTREAM_HEADERS });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

function mapAnimeList(list = []) {
  return list.map((a) => ({
    title: a.title || "",
    slug: a.animeId || a.batchId || "",
    poster: a.poster || "",
    episode: a.episodes ? `Ep ${a.episodes}` : a.latestEps ? `Ep ${a.latestEps}` : "",
    type: a.type || "TV",
    rating: a.score || "",
    score: a.score || "",
    status: a.status || "",
    href: a.href || "",
    releaseDay: a.releaseDay || "",
    latestReleaseDate: a.latestReleaseDate || a.releasedOn || "",
  }));
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=86400");

  if (req.method === "OPTIONS") return res.status(200).end();

  const segments = Array.isArray(req.query.path)
    ? req.query.path
    : req.query.path ? [req.query.path] : [];

  const url = new URL(req.url, "http://localhost");
  const query = url.search || "";
  const [seg0, seg1] = segments;

  try {
    // ── HOME ──────────────────────────────────────────────────────────────
    if (seg0 === "home" && !seg1) {
      const json = await fetchAPI("/home");
      const recent = json?.data?.recent?.animeList || [];
      const ongoing = json?.data?.ongoing?.animeList || [];
      const seen = new Set();
      const unique = [...recent, ...ongoing].filter((a) => {
        if (seen.has(a.animeId)) return false;
        seen.add(a.animeId);
        return true;
      });
      return res.json(mapAnimeList(unique));
    }

    // ── RECENT ────────────────────────────────────────────────────────────
    if (seg0 === "recent" && !seg1) {
      const json = await fetchAPI("/recent");
      return res.json(mapAnimeList(json?.data?.animeList || []));
    }

    // ── SCHEDULE ──────────────────────────────────────────────────────────
    if (seg0 === "schedule" && !seg1) {
      const json = await fetchAPI("/schedule");
      const days = json?.data?.days || [];
      return res.json(days.map((d) => ({
        day: d.day,
        animes: mapAnimeList(d.animeList || []),
      })));
    }

    // ── SEARCH ────────────────────────────────────────────────────────────
    if (seg0 === "search" && !seg1) {
      const json = await fetchAPI(`/search${query}`);
      return res.json(mapAnimeList(json?.data?.animeList || []));
    }

    // ── LIST PAGES ────────────────────────────────────────────────────────
    if (["ongoing", "completed", "popular", "movies"].includes(seg0) && !seg1) {
      const json = await fetchAPI(`/${seg0}${query}`);
      return res.json(mapAnimeList(json?.data?.animeList || []));
    }

    // ── BATCH ─────────────────────────────────────────────────────────────
    if (seg0 === "batch" && !seg1) {
      const json = await fetchAPI(`/batch${query}`);
      return res.json(mapAnimeList(json?.data?.batchList || []));
    }

    // ── GENRES LIST ───────────────────────────────────────────────────────
    if (seg0 === "genres" && !seg1) {
      const json = await fetchAPI("/genres");
      return res.json((json?.data?.genreList || []).map((g) => ({
        title: g.title,
        genreId: g.genreId,
        href: g.href,
      })));
    }

    // ── GENRE DETAIL ──────────────────────────────────────────────────────
    if (seg0 === "genres" && seg1) {
      const json = await fetchAPI(`/genres/${seg1}${query}`);
      return res.json(mapAnimeList(json?.data?.animeList || []));
    }

    // ── GENRE (alias dari Browse.tsx) ─────────────────────────────────────
    if (seg0 === "genre" && !seg1) {
      const genreId = url.searchParams.get("genre") || "action";
      const page = url.searchParams.get("page") || "1";
      const json = await fetchAPI(`/genres/${genreId}?page=${page}`);
      return res.json(mapAnimeList(json?.data?.animeList || []));
    }

    // ── ANIME DETAIL ──────────────────────────────────────────────────────
    if (seg0 === "detail" && seg1) {
      const json = await fetchAPI(`/anime/${seg1}`);
      const d = json?.data || {};
      const synopsis = typeof d.synopsis === "string"
        ? d.synopsis
        : (d.synopsis?.paragraphs || []).join(" ").trim();
      const score = typeof d.score === "object" ? (d.score?.value || "") : (d.score || "");
      return res.json({
        title: d.title || "",
        poster: d.poster || "",
        japanese: d.japanese || "",
        score,
        producers: d.producers || "",
        type: d.type || "",
        status: d.status || "",
        episodes: d.episodes,
        duration: d.duration || "",
        aired: d.aired || "",
        studios: d.studios || "",
        synopsis,
        genreList: (d.genreList || []).map((g) => ({ title: g.title, slug: g.genreId })),
        episodeList: (d.episodeList || []).map((ep) => ({
          title: ep.title,
          eps: ep.title,
          date: ep.date || "",
          episodeId: ep.episodeId,
          href: ep.href,
        })),
      });
    }

    // ── EPISODE (halaman Watch) ────────────────────────────────────────────
    if (seg0 === "episode" && seg1) {
      const json = await fetchAPI(`/episode/${seg1}`);
      const d = json?.data || {};
      const synopsis = typeof d.synopsis === "string"
        ? d.synopsis
        : (d.synopsis?.paragraphs || []).join(" ").trim();

      const servers = [];
      for (const q of d.server?.qualities || []) {
        for (const s of q.serverList || []) {
          if (s.serverId) {
            servers.push({ name: s.title || "", serverId: s.serverId, quality: q.title || "" });
          }
        }
      }

      return res.json({
        title: d.title || "",
        anime: d.animeId || "",
        animeId: d.animeId || "",
        defaultStreamingUrl: d.defaultStreamingUrl || "",
        poster: d.poster || "",
        releaseTime: d.releasedOn || "",
        synopsis,
        servers,
        prevEpisode: d.prevEpisode
          ? { title: d.prevEpisode.title || "Prev", episodeId: d.prevEpisode.episodeId, href: d.prevEpisode.href }
          : null,
        nextEpisode: d.nextEpisode
          ? { title: d.nextEpisode.title || "Next", episodeId: d.nextEpisode.episodeId, href: d.nextEpisode.href }
          : null,
      });
    }

    // ── SERVER (URL streaming langsung) ───────────────────────────────────
    if (seg0 === "server" && seg1) {
      const json = await fetchAPI(`/server/${seg1}`);
      const streamUrl = json?.data?.url || json?.url || "";
      return res.json({ url: streamUrl });
    }

    // ── WINBU SERVER ──────────────────────────────────────────────────────
    if (seg0 === "winbu" && seg1 === "server") {
      const post = url.searchParams.get("post") || "";
      const nume = url.searchParams.get("nume") || "1";
      const type = url.searchParams.get("type") || "schtml";
      const upRes = await fetch("https://wibusave.com/wp-admin/admin-ajax.php", {
        method: "POST",
        headers: {
          ...UPSTREAM_HEADERS,
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: new URLSearchParams({ action: "doo_player_ajax", post, nume, type }).toString(),
      });
      const upJson = await upRes.json().catch(() => ({}));
      const streamUrl = upJson?.embed_url || upJson?.data?.embed_url || upJson?.url || "";
      return res.json({ url: streamUrl });
    }

    // ── GOFILE ─────────────────────────────────────────────────────────────
    if (seg0 === "gofile" && !seg1) {
      const id = url.searchParams.get("id") || "";
      if (!id) return res.status(400).json({ error: "Missing id" });
      const gfRes = await fetch(`https://api.gofile.io/contents/${id}?wt=4fd6sg89d7s6&cache=true`, {
        headers: { "User-Agent": UPSTREAM_HEADERS["User-Agent"] }
      });
      const gfJson = await gfRes.json().catch(() => ({}));
      const files = Object.values(gfJson?.data?.children || {});
      const videoFile = files.find((f) => f.mimetype?.includes("video")) || files[0];
      const streamUrl = videoFile?.link || "";
      return res.json({ url: streamUrl });
    }

    // ── PROXY (embed iframe) ───────────────────────────────────────────────
    if (seg0 === "proxy") {
      const targetUrl = url.searchParams.get("url");
      if (!targetUrl) return res.status(400).json({ error: "Missing url param" });
      const upstream = await fetch(targetUrl, {
        headers: { ...UPSTREAM_HEADERS, Accept: "text/html,application/xhtml+xml,*/*" },
      });
      const body = await upstream.text();
      const contentType = upstream.headers.get("content-type") || "text/html; charset=utf-8";
      res.removeHeader("X-Frame-Options");
      res.removeHeader("Content-Security-Policy");
      res.setHeader("Content-Type", contentType);
      return res.status(upstream.status).send(body);
    }

    // ── FALLBACK ──────────────────────────────────────────────────────────
    const upstreamPath = "/" + segments.join("/");
    const target = `${BASE}${upstreamPath}${query}`;
    const upstream = await fetch(target, { headers: UPSTREAM_HEADERS });
    const body = await upstream.text();
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    return res.status(upstream.status).send(body);

  } catch (err) {
    return res.status(502).json({ error: "Upstream fetch failed", detail: String(err) });
  }
}
