export interface AnimeListItem {
  title: string;
  poster: string;
  type: string;
  score?: string;
  status: string;
  animeId: string;
  href: string;
  episodes: string;
  releasedOn?: string;
}

export interface GenreItem {
  title: string;
  genreId: string;
  href: string;
}

export interface ScheduleDay {
  day: string;
  animeList: AnimeListItem[];
}

export interface AnimeDetail {
  title: string;
  poster: string;
  score: { value: string; users: string };
  synopsis: string;
  status: string;
  type: string;
  genres: GenreItem[];
  episodes: any[];
}

export interface AnimeApiResponse {
  data: any;
  message?: string;
  success?: boolean;
}
