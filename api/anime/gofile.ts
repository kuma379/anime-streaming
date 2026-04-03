import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const contentId = req.query.id as string;
  if (!contentId) return res.status(400).json({ error: "Missing id" });

  try {
    const accountRes = await axios.post("https://api.gofile.io/accounts", {}, { timeout: 10000 });
    const token = accountRes.data?.data?.token;
    if (!token) return res.status(500).json({ error: "Failed to get GoFile token" });

    const contentRes = await axios.get(`https://api.gofile.io/contents/${contentId}`, {
      params: { wt: token },
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15000,
    });

    const contents = contentRes.data?.data?.contents;
    if (!contents) return res.status(404).json({ error: "No contents found" });

    const files = Object.values(contents) as Record<string, unknown>[];
    const video = files.find((f: Record<string, unknown>) =>
      typeof f.mimetype === "string" && f.mimetype.startsWith("video/")
    ) || files[0];

    if (!video) return res.status(404).json({ error: "No video file found" });

    return res.status(200).json({ url: video.link || video.directLink || "" });
  } catch (err) {
    console.error("gofile error:", err);
    return res.status(500).json({ error: "Failed to fetch GoFile content" });
  }
}
