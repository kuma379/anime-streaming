const BASE = "https://sankavollerei.com/anime/samehadaku";

export default async function handler(req, res) {
  // req.query.path is an array of path segments from [...path]
  const segments = req.query.path || [];
  const upstreamPath = "/" + segments.join("/");

  const url = new URL(req.url, "http://localhost");
  const query = url.search || "";

  const target = `${BASE}${upstreamPath}${query}`;

  try {
    const upstream = await fetch(target, {
      method: "GET",
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
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Content-Type", contentType);
    res.status(upstream.status).send(body);
  } catch (err) {
    res
      .status(502)
      .json({ error: "Upstream fetch failed", detail: String(err) });
  }
}
