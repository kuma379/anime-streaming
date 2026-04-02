import axios from "axios";

const client = axios.create({ baseURL: "/api/anime", timeout: 20000 });

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

export async function fetchHome(): Promise<AnimeItem[]> {
  const { data } = await client.get<AnimeItem[]>("/home");
  return data;
}

export async function fetchSchedule(): Promise<ScheduleDay[]> {
  const { data } = await client.get<ScheduleDay[]>("/schedule");
  return data;
}

export async function fetchEpisode(slug: string): Promise<EpisodeDetail> {
  const { data } = await client.get<EpisodeDetail>(`/episode/${encodeURIComponent(slug)}`);
  return data;
}

export async function fetchServer(serverId: string): Promise<{ url: string }> {
  const { data } = await client.get<{ url: string }>(`/server/${encodeURIComponent(serverId)}`);
  return data;
}

export async function fetchWinbuServer(post: string, nume = "1", type = "schtml"): Promise<{ url: string }> {
  const { data } = await client.get<{ url: string }>("/winbu/server", { params: { post, nume, type } });
  return data;
}
