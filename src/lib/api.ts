const BASE = "/api/anime";

export interface AnimeItem {
  title: string;
  slug: string;
  poster?: string;
  episode?: string;
  type?: string;
  status?: string;
  rating?: string;
  genres?: string[];
}

export interface ScheduleDay {
  day: string;
  animes: AnimeItem[];
}

export interface EpisodeServer {
  name: string;
  serverId: string;
}

export interface EpisodeDetail {
  title: string;
  anime: string;
  episode: string;
  servers: EpisodeServer[];
  synopsis?: string;
  poster?: string;
}

export interface VideoServer {
  url: string;
  type: string;
}

export async function fetchHome(): Promise<AnimeItem[]> {
  const res = await fetch(`${BASE}/home`);
  if (!res.ok) throw new Error("Failed to fetch home");
  return res.json();
}

export async function fetchSchedule(): Promise<ScheduleDay[]> {
  const res = await fetch(`${BASE}/schedule`);
  if (!res.ok) throw new Error("Failed to fetch schedule");
  return res.json();
}

export async function fetchEpisode(slug: string): Promise<EpisodeDetail> {
  const res = await fetch(`${BASE}/episode/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error("Failed to fetch episode");
  return res.json();
}

export async function fetchServer(serverId: string): Promise<VideoServer> {
  const res = await fetch(`${BASE}/server/${encodeURIComponent(serverId)}`);
  if (!res.ok) throw new Error("Failed to fetch server");
  return res.json();
}

export async function fetchWinbuServer(post: string, nume: string, type: string): Promise<VideoServer> {
  const params = new URLSearchParams({ post, nume, type });
  const res = await fetch(`${BASE}/winbu/server?${params}`);
  if (!res.ok) throw new Error("Failed to fetch winbu server");
  return res.json();
}
