const BASE = "https://www.sankavollerei.com/anime/samehadaku";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  "Accept": "application/json, */*",
  "Referer": "https://www.sankavollerei.com/",
};

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const [homeRes, recentRes, ongoingRes, scheduleRes] = await Promise.allSettled([
      fetch(`${BASE}/home`, { headers: HEADERS }),
      fetch(`${BASE}/recent`, { headers: HEADERS }),
      fetch(`${BASE}/ongoing`, { headers: HEADERS }),
      fetch(`${BASE}/schedule`, { headers: HEADERS }),
    ]);

    const results = {};

    if (homeRes.status === "fulfilled" && homeRes.value.ok) {
      const json = await homeRes.value.json();
      const recent = json?.data?.recent?.animeList || [];
      results.home = {
        latestEpisode: recent[0]?.title || "-",
        count: recent.length,
      };
    }

    if (recentRes.status === "fulfilled" && recentRes.value.ok) {
      const json = await recentRes.value.json();
      const list = json?.data?.animeList || [];
      results.recent = { count: list.length, latest: list[0]?.title || "-" };
    }

    if (ongoingRes.status === "fulfilled" && ongoingRes.value.ok) {
      const json = await ongoingRes.value.json();
      results.ongoing = { count: json?.data?.animeList?.length || 0 };
    }

    if (scheduleRes.status === "fulfilled" && scheduleRes.value.ok) {
      const json = await scheduleRes.value.json();
      results.schedule = { days: json?.data?.days?.length || 0 };
    }

    console.log(`[CRON daily] ${new Date().toISOString()}`, JSON.stringify(results));

    return res.status(200).json({
      ok: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (err) {
    console.error("[CRON daily] error:", err);
    return res.status(500).json({ error: String(err) });
  }
}
