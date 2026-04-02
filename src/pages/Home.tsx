import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Play, ChevronRight, Flame, Clock, Star, TrendingUp } from "lucide-react";
import { AnimeCard } from "@/components/AnimeCard";
import { AdBanner } from "@/components/AdBanner";
import { Contact } from "@/components/Contact";
import { type AnimeItem, fetchHome } from "@/lib/api";

const FALLBACK_RECENT: AnimeItem[] = [
  { title: "Sword Art Online Progressive: Scherzo of Deep Night", slug: "sao-scherzo-sub-indo-episode-1", poster: "https://cdn.myanimelist.net/images/anime/1764/126627l.jpg", episode: "Episode 1", type: "Movie", rating: "8.1" },
  { title: "Demon Slayer: Kimetsu no Yaiba - Hashira Training Arc", slug: "kimetsu-no-yaiba-s4-episode-8-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1765/135099l.jpg", episode: "Episode 8", type: "TV", rating: "9.0" },
  { title: "Solo Leveling Season 2", slug: "solo-leveling-s2-episode-10-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1980/141389l.jpg", episode: "Episode 10", type: "TV", rating: "8.7" },
  { title: "One Piece", slug: "one-piece-episode-1110-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/6/73245l.jpg", episode: "Episode 1110", type: "TV", rating: "9.0" },
  { title: "Re:Zero - Starting Life in Another World Season 3", slug: "rezero-s3-episode-14-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1550/142396l.jpg", episode: "Episode 14", type: "TV", rating: "8.9" },
  { title: "Bleach: Thousand-Year Blood War - The Conflict", slug: "bleach-tybw-episode-21-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1764/128381l.jpg", episode: "Episode 21", type: "TV", rating: "9.1" },
  { title: "Attack on Titan Final Season", slug: "shingeki-no-kyojin-final-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1773/128009l.jpg", episode: "Episode 30", type: "TV", rating: "9.0" },
  { title: "Jujutsu Kaisen Season 3", slug: "jujutsu-kaisen-s3-episode-5-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1792/138022l.jpg", episode: "Episode 5", type: "TV", rating: "8.8" },
];

const FALLBACK_POPULAR: AnimeItem[] = [
  { title: "Fullmetal Alchemist: Brotherhood", slug: "fma-brotherhood-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1223/96541l.jpg", type: "TV", rating: "9.1" },
  { title: "Steins;Gate", slug: "steins-gate-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/5/73199l.jpg", type: "TV", rating: "9.1" },
  { title: "Hunter x Hunter (2011)", slug: "hunter-x-hunter-2011-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1337/99013l.jpg", type: "TV", rating: "9.0" },
  { title: "Violet Evergarden", slug: "violet-evergarden-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1795/95088l.jpg", type: "TV", rating: "8.7" },
  { title: "Your Name", slug: "kimi-no-na-wa-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/5/87048l.jpg", type: "Movie", rating: "9.0" },
  { title: "Spirited Away", slug: "spirited-away-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/6/79597l.jpg", type: "Movie", rating: "8.9" },
];

const HERO_ANIME = {
  title: "Demon Slayer: Kimetsu no Yaiba - Hashira Training Arc",
  description: "Tanjiro dan kawan-kawan bergabung dengan latihan Hashira yang intens untuk mempersiapkan diri menghadapi ancaman Muzan Kibutsuji. Setiap Hashira memiliki metode pelatihan yang unik dan mematikan.",
  poster: "https://cdn.myanimelist.net/images/anime/1765/135099l.jpg",
  slug: "kimetsu-no-yaiba-s4-episode-8-sub-indo",
  rating: "9.0",
  genre: ["Action", "Fantasy", "Shounen"],
};

export default function Home() {
  const [recentAnime, setRecentAnime] = useState<AnimeItem[]>(FALLBACK_RECENT);
  const [popularAnime, setPopularAnime] = useState<AnimeItem[]>(FALLBACK_POPULAR);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHome()
      .then((data) => {
        if (data && data.length > 0) {
          setRecentAnime(data.slice(0, 8));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(222,47%,5%)]">
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_ANIME.poster}
            alt={HERO_ANIME.title}
            className="w-full h-full object-cover scale-110"
            style={{ filter: "blur(2px)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(222,47%,5%)] via-[hsl(222,47%,5%)/80] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(222,47%,5%)] via-transparent to-[hsl(222,47%,5%)/40]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-purple-600 text-white px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide">
                Featured
              </span>
              {HERO_ANIME.genre.map((g) => (
                <span key={g} className="text-xs text-gray-400 border border-gray-600 px-2 py-0.5 rounded-full">
                  {g}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              {HERO_ANIME.title}
            </h1>
            <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-6 max-w-md">
              {HERO_ANIME.description}
            </p>
            <div className="flex items-center gap-4">
              <Link
                href={`/tonton/${HERO_ANIME.slug}`}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
              >
                <Play className="w-5 h-5 fill-white" />
                Tonton Sekarang
              </Link>
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-semibold">{HERO_ANIME.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Episode Terbaru</h2>
            </div>
            <Link href="/jadwal" className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-[hsl(222,47%,12%)] rounded-lg mb-2" />
                  <div className="h-4 bg-[hsl(222,47%,12%)] rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {recentAnime.slice(0, 8).map((anime, i) => (
                <AnimeCard key={i} anime={anime} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <h2 className="text-xl font-bold text-white">Anime Populer</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularAnime.map((anime, i) => (
              <AnimeCard key={i} anime={anime} />
            ))}
          </div>
        </section>

        <AdBanner position="top" />

        <section className="bg-[hsl(222,47%,8%)] rounded-2xl p-6 border border-purple-900/20">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Jadwal Rilis Minggu Ini</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day, i) => (
              <Link
                key={day}
                href="/jadwal"
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[hsl(222,47%,12%)] hover:bg-purple-900/40 transition-colors group"
              >
                <span className="text-xs text-gray-400 group-hover:text-purple-300">{day}</span>
                <span className="text-lg font-bold text-white">{i + 14}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              </Link>
            ))}
          </div>
        </section>

        <AdBanner position="bottom" />

        <Contact />
      </div>
    </div>
  );
}
