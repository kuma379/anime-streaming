import { Router } from "express";
import axios from "axios";

const router = Router();

const api = axios.create({
  baseURL: "https://www.sankavollerei.com",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    Accept: "application/json, text/html, */*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
    Referer: "https://www.sankavollerei.com",
  },
  timeout: 20000,
  decompress: true,
  validateStatus: () => true,
});

router.get("/anime/home", async (_req, res) => {
  try {
    const { data } = await api.get("/anime/home");
    const list: Record<string, unknown>[] =
      data?.data?.ongoing?.animeList || [];
    const mapped = list.map((a) => ({
      title: a.title,
      slug: a.animeId,
      poster: a.poster,
      episode: a.episodes ? `Ep ${a.episodes}` : "",
      releaseDay: a.releaseDay,
      latestReleaseDate: a.latestReleaseDate,
      href: a.href,
      type: "TV",
    }));
    res.json(mapped);
  } catch (err) {
    console.error("home error:", err);
    res.status(500).json({ error: "Failed to fetch home" });
  }
});

router.get("/anime/schedule", async (_req, res) => {
  try {
    const { data } = await api.get("/anime/schedule");
    const rawDays: Record<string, unknown>[] = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];
    const mapped = rawDays.map((d) => ({
      day: d.day,
      animes: (
        (d.animeList as Record<string, unknown>[]) ||
        (d.anime_list as Record<string, unknown>[]) ||
        []
      ).map((a) => ({
        title: a.title,
        slug: a.animeId || a.slug,
        poster: a.poster,
        href: a.href || a.url,
        episode: a.latestEps ? `Ep ${a.latestEps}` : "",
      })),
    }));
    res.json(mapped);
  } catch (err) {
    console.error("schedule error:", err);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

router.get("/anime/detail/:animeId", async (req, res) => {
  const { animeId } = req.params;
  if (!animeId) {
    res.status(400).json({ error: "Missing animeId" });
    return;
  }
  try {
    const { data, status } = await api.get(`/anime/anime/${animeId}`);
    if (status !== 200 || !data?.data) {
      res.status(404).json({ error: "Anime tidak ditemukan" });
      return;
    }
    const d = data.data;
    const episodeList = ((d.episodeList as Record<string, unknown>[]) || []).map(
      (ep) => ({
        title: ep.title,
        eps: ep.eps,
        date: ep.date,
        episodeId: ep.episodeId,
        href: ep.href,
      })
    );
    const recommended = (
      (d.recommendedAnimeList as Record<string, unknown>[]) || []
    ).map((r) => ({
      title: r.title,
      slug: r.animeId,
      poster: r.poster,
      type: r.type || "TV",
    }));

    // synopsis may be an object {paragraphs:[], connections:[]} — flatten to string
    let synopsis = "";
    if (typeof d.synopsis === "string") {
      synopsis = d.synopsis;
    } else if (d.synopsis && typeof d.synopsis === "object") {
      const synObj = d.synopsis as Record<string, unknown>;
      const paras = Array.isArray(synObj.paragraphs) ? synObj.paragraphs as string[] : [];
      synopsis = paras.join(" ").trim();
    }

    // genreList: normalize slug field (API uses genreId)
    const genreList = ((d.genreList as Record<string, unknown>[]) || []).map((g) => ({
      title: g.title,
      slug: g.genreId || g.slug || "",
    }));

    res.json({
      title: d.title,
      poster: d.poster,
      japanese: d.japanese,
      score: d.score,
      producers: d.producers,
      type: d.type,
      status: d.status,
      episodes: d.episodes,
      duration: d.duration,
      aired: d.aired,
      studios: d.studios,
      synopsis,
      genreList,
      episodeList,
      recommended,
    });
  } catch (err) {
    console.error("detail error:", err);
    res.status(500).json({ error: "Failed to fetch anime detail" });
  }
});

router.get("/anime/episode/:slug", async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    res.status(400).json({ error: "Missing slug" });
    return;
  }
  try {
    const { data, status } = await api.get(`/anime/episode/${slug}`);
    if (status !== 200 || !data?.data) {
      res.status(404).json({ error: "Episode tidak ditemukan" });
      return;
    }
    const d = data.data;

    const qualities: Record<string, unknown>[] = d?.server?.qualities || [];
    const servers: { name: string; serverId: string; quality: string }[] = [];
    for (const q of qualities) {
      const qTitle = q.title as string;
      const serverList = (q.serverList as Record<string, unknown>[]) || [];
      for (const s of serverList) {
        servers.push({
          name: String(s.title).trim(),
          serverId: s.serverId as string,
          quality: qTitle,
        });
      }
    }

    const mapEpisodeNav = (nav: Record<string, unknown> | null | undefined) => {
      if (!nav) return null;
      return {
        title: nav.title || "",
        episodeId: nav.episodeId || "",
        href: nav.href || "",
      };
    };

    res.json({
      title: d?.title || slug.replace(/-/g, " "),
      animeId: d?.animeId || "",
      defaultStreamingUrl: d?.defaultStreamingUrl || "",
      releaseTime: d?.releaseTime || "",
      prevEpisode: mapEpisodeNav(d?.prevEpisode as Record<string, unknown>),
      nextEpisode: mapEpisodeNav(d?.nextEpisode as Record<string, unknown>),
      servers,
      synopsis: d?.info?.synopsis || "",
      poster: d?.info?.poster || "",
      anime: d?.animeId || "",
    });
  } catch (err) {
    console.error("episode error:", err);
    res.status(500).json({ error: "Failed to fetch episode" });
  }
});

router.get("/anime/server/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ error: "Missing server id" });
    return;
  }
  try {
    const { data, status } = await api.get(`/anime/server/${id}`);
    if (status !== 200) {
      res.status(404).json({ url: "" });
      return;
    }
    const url = data?.data?.url || data?.url || "";
    res.json({ url });
  } catch (err) {
    console.error("server error:", err);
    res.status(500).json({ error: "Failed to fetch server" });
  }
});

router.get("/anime/winbu/server", async (req, res) => {
  const { post, nume = "1", type = "schtml" } = req.query as Record<
    string,
    string
  >;
  if (!post) {
    res.status(400).json({ error: "Missing post parameter" });
    return;
  }
  try {
    const { data } = await api.get("/anime/winbu/server", {
      params: { post, nume, type },
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });
    const url =
      data?.embed_url || data?.data?.embed_url || data?.url || "";
    res.json({ url });
  } catch (err) {
    console.error("winbu error:", err);
    res.status(500).json({ error: "Failed to fetch winbu server" });
  }
});

router.get("/anime/proxy", async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    res.status(400).send("Missing url param");
    return;
  }
  try {
    const upstream = await axios.get(targetUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,*/*",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: "https://www.sankavollerei.com/",
        Origin: "https://www.sankavollerei.com",
      },
      timeout: 20000,
      decompress: true,
      validateStatus: () => true,
    });

    res.removeHeader("X-Frame-Options");
    res.removeHeader("Content-Security-Policy");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Content-Type",
      upstream.headers["content-type"] || "text/html; charset=utf-8",
    );

    res.status(upstream.status).send(upstream.data);
  } catch (err) {
    console.error("proxy error:", err);
    res.status(502).send("Proxy error");
  }
});

export default router;
