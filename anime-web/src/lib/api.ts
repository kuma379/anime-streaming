import axios from "axios";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const client = axios.create({ baseURL: `${BASE}/api/anime`, timeout: 20000 });

export interface AnimeItem {
  title: string;
  slug: string;
  poster?: string;
  episode?: string;
  type?: string;
  rating?: string;
  releaseDay?: string;
  latestReleaseDate?: string;
  href?: string;
}

export interface ScheduleDay {
  day: string;
  animes: AnimeItem[];
}

export interface EpisodeServer {
  name: string;
  serverId: string;
  quality?: string;
}

export interface EpisodeNav {
  title: string;
  episodeId: string;
  href: string;
}

export interface EpisodeDetail {
  title: string;
  anime: string;
  animeId?: string;
  defaultStreamingUrl: string;
  releaseTime?: string;
  servers: EpisodeServer[];
  prevEpisode?: EpisodeNav | null;
  nextEpisode?: EpisodeNav | null;
  synopsis?: string;
  poster?: string;
}

export interface EpisodeListItem {
  title: string;
  eps: number;
  date: string;
  episodeId: string;
  href: string;
}

export interface AnimeDetail {
  title: string;
  poster: string;
  japanese?: string;
  score?: string;
  producers?: string;
  type?: string;
  status?: string;
  episodes?: number | string;
  duration?: string;
  aired?: string;
  studios?: string;
  synopsis?: string;
  genreList: { title: string; slug: string }[];
  episodeList: EpisodeListItem[];
  recommended: AnimeItem[];
}

export async function fetchHome(): Promise<AnimeItem[]> {
  const { data } = await client.get<AnimeItem[]>("/home");
  return data;
}

export async function fetchSchedule(): Promise<ScheduleDay[]> {
  const { data } = await client.get<ScheduleDay[]>("/schedule");
  return data;
}

export async function fetchAnimeDetail(animeId: string): Promise<AnimeDetail> {
  const { data } = await client.get<AnimeDetail>(
    `/detail/${encodeURIComponent(animeId)}`,
  );
  return data;
}

export async function fetchEpisode(slug: string): Promise<EpisodeDetail> {
  const { data } = await client.get<EpisodeDetail>(
    `/episode/${encodeURIComponent(slug)}`,
  );
  return data;
}

export async function fetchServer(
  serverId: string,
): Promise<{ url: string }> {
  const { data } = await client.get<{ url: string }>(
    `/server/${encodeURIComponent(serverId)}`,
  );
  return data;
}

export async function fetchWinbuServer(
  post: string,
  nume = "1",
  type = "schtml",
): Promise<{ url: string }> {
  const { data } = await client.get<{ url: string }>("/winbu/server", {
    params: { post, nume, type },
  });
  return data;
}

export function getProxiedUrl(url: string): string {
  if (!url) return "";
  const isDirect = /\.(mp4|mkv|webm|m3u8)(\?|$)/i.test(url);
  if (isDirect) return url;
  return `${BASE}/api/anime/proxy?url=${encodeURIComponent(url)}`;
}
