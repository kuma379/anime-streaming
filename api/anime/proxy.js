const BASE = "https://sankavollerei.com/anime/samehadaku";

export default async function handler(req, res) {
  const url = new URL(req.url, "http://localhost");

  // Strip /api/anime prefix to get the actual upstream path
  const upstreamPath = url.pathname.replace(/^\/api\/anime/, "") || "/";
  const query = url.search || "";
  const target = `${BASE}${upstreamPath}${query}`;

  try {
    const upstream = await fetch(target, {
      method: req.method || "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Referer: "https://samehadaku.email/",
        Origin: "https://samehadaku.email",
        Accept: "application/json, */*",
      },
    });

    const contentType =
      upstream.headers.get("content-type") || "application/json";
    const body = await upstream.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Content-Type", contentType);
    res.status(upstream.status).send(body);
  } catch (err) {
    res
      .status(502)
      .json({ error: "Upstream fetch failed", detail: String(err) });
  }
}
