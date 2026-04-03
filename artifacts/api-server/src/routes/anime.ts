import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

const BASE_URL = "https://www.sankavollerei.com/anime/samehadaku";

async function fetchFromApi(path: string): Promise<unknown> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; AnimeAPI/1.0)",
    },
  });

  if (!response.ok) {
    throw new Error(`Upstream API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function asyncHandler(fn: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response) => {
    fn(req, res).catch((err: Error) => {
      res.status(502).json({ error: "Failed to fetch from upstream API", message: err.message });
    });
  };
}

router.get("/anime/home", asyncHandler(async (_req, res) => {
  const data = await fetchFromApi("/home");
  res.json(data);
}));

router.get("/anime/recent", asyncHandler(async (_req, res) => {
  const data = await fetchFromApi("/recent");
  res.json(data);
}));

router.get("/anime/search", asyncHandler(async (req, res) => {
  const q = req.query.q as string | undefined;
  const path = q ? `/search?q=${encodeURIComponent(q)}` : "/search";
  const data = await fetchFromApi(path);
  res.json(data);
}));

router.get("/anime/ongoing", asyncHandler(async (_req, res) => {
  const data = await fetchFromApi("/ongoing");
  res.json(data);
}));

router.get("/anime/completed", asyncHandler(async (_req, res) => {
  const data = await fetchFromApi("/completed");
  res.json(data);
}));

router.get("/anime/popular", asyncHandler(async (_req, res) => {
  const data = await fetchFromApi("/popular");
  res.json(data);
}));

router.get("/anime/movies", asyncHandler(async (_req, res) => {
  const data = await fetchFromApi("/movies");
  res.json(data);
}));

router.get("/anime/schedule", asyncHandler(async (_req, res) => {
  const data = await fetchFromApi("/schedule");
  res.json(data);
}));

router.get("/anime/genres", asyncHandler(async (_req, res) => {
  const data = await fetchFromApi("/genres");
  res.json(data);
}));

router.get("/anime/genres/:genre", asyncHandler(async (req, res) => {
  const { genre } = req.params;
  const data = await fetchFromApi(`/genres/${encodeURIComponent(genre)}`);
  res.json(data);
}));

router.get("/anime/batch", asyncHandler(async (_req, res) => {
  const data = await fetchFromApi("/batch");
  res.json(data);
}));

router.get("/anime/detail/:slug", asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const data = await fetchFromApi(`/anime/${encodeURIComponent(slug)}`);
  res.json(data);
}));

router.get("/anime/episode/:episodeId", asyncHandler(async (req, res) => {
  const { episodeId } = req.params;
  const data = await fetchFromApi(`/episode/${encodeURIComponent(episodeId)}`);
  res.json(data);
}));

router.get("/anime/server/:serverId", asyncHandler(async (req, res) => {
  const { serverId } = req.params;
  const data = await fetchFromApi(`/server/${encodeURIComponent(serverId)}`);
  res.json(data);
}));

export default router;
