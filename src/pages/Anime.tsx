import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import {
  ArrowLeft, Play, Star, Calendar, Clock, Tv, Loader2,
  AlertCircle, ChevronRight, Film, Users, Tag
} from "lucide-react";
import { AdBanner } from "@/components/AdBanner";

interface Genre { title: string; slug: string; }
interface Episode { title: string; eps: number; date: string; episodeId: string; href: string; }
interface AnimeDetail {
  title: string;
  poster: string;
  japanese: string;
  score: string;
  producers: string;
  type: string;
  status: string;
  episodes: number | null;
  duration: string;
  aired: string;
  studios: string;
  synopsis: string;
  genreList: Genre[];
  episodeList: Episode[];
}

async function fetchAnimeDetail(id: string): Promise<AnimeDetail> {
  const res = await fetch(`/api/anime/detail/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error("Gagal memuat detail anime");
  return res.json();
}

export default function AnimePage() {
  const params = useParams<{ animeId: string }>();
  const animeId = params?.animeId || "";

  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!animeId) return;
    setLoading(true);
    setError(null);
    fetchAnimeDetail(animeId)
      .then(setAnime)
      .catch(() => setError("Gagal memuat detail anime. Coba lagi."))
      .finally(() => setLoading(false));
  }, [animeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(222,47%,5%)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Memuat detail anime...</p>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-[hsl(222,47%,5%)] flex items-center justify-center">
        <div className="text-center px-4">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-gray-300 mb-4">{error || "Anime tidak ditemukan."}</p>
          <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 justify-center">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const episodes = anime.episodeList || [];
  const displayed = showAll ? episodes : episodes.slice(0, 20);
  const latestEpisode = episodes[0];

  return (
    <div className="min-h-screen bg-[hsl(222,47%,5%)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Beranda
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-gray-300 text-sm line-clamp-1">{anime.title}</span>
        </div>

        <AdBanner position="top" />

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-40 sm:w-48 mx-auto sm:mx-0">
              {anime.poster ? (
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-full rounded-xl shadow-2xl shadow-purple-900/40 object-cover"
                />
              ) : (
                <div className="w-full aspect-[3/4] rounded-xl bg-[hsl(222,47%,12%)] flex items-center justify-center">
                  <Film className="w-12 h-12 text-gray-600" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-white leading-snug">{anime.title}</h1>
              {anime.japanese && (
                <p className="text-gray-400 text-sm mt-1">{anime.japanese}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {anime.genreList.map((g) => (
                <span key={g.slug} className="text-xs bg-purple-900/40 text-purple-300 border border-purple-800/40 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {g.title}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {anime.score && (
                <div className="bg-[hsl(222,47%,8%)] rounded-xl p-3 border border-purple-900/20">
                  <div className="flex items-center gap-1.5 text-yellow-400 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <span className="text-xs text-gray-400">Rating</span>
                  </div>
                  <p className="text-white font-semibold">{anime.score}</p>
                </div>
              )}
              {anime.type && (
                <div className="bg-[hsl(222,47%,8%)] rounded-xl p-3 border border-purple-900/20">
                  <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                    <Tv className="w-4 h-4" />
                    <span className="text-xs text-gray-400">Tipe</span>
                  </div>
                  <p className="text-white font-semibold">{anime.type}</p>
                </div>
              )}
              {anime.status && (
                <div className="bg-[hsl(222,47%,8%)] rounded-xl p-3 border border-purple-900/20">
                  <div className="flex items-center gap-1.5 text-green-400 mb-1">
                    <Play className="w-4 h-4" />
                    <span className="text-xs text-gray-400">Status</span>
                  </div>
                  <p className="text-white font-semibold text-sm">{anime.status}</p>
                </div>
              )}
              {anime.duration && (
                <div className="bg-[hsl(222,47%,8%)] rounded-xl p-3 border border-purple-900/20">
                  <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs text-gray-400">Durasi</span>
                  </div>
                  <p className="text-white font-semibold text-sm">{anime.duration}</p>
                </div>
              )}
              {anime.aired && (
                <div className="bg-[hsl(222,47%,8%)] rounded-xl p-3 border border-purple-900/20">
                  <div className="flex items-center gap-1.5 text-orange-400 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs text-gray-400">Tayang</span>
                  </div>
                  <p className="text-white font-semibold text-sm">{anime.aired}</p>
                </div>
              )}
              {anime.studios && (
                <div className="bg-[hsl(222,47%,8%)] rounded-xl p-3 border border-purple-900/20">
                  <div className="flex items-center gap-1.5 text-pink-400 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs text-gray-400">Studio</span>
                  </div>
                  <p className="text-white font-semibold text-sm">{anime.studios}</p>
                </div>
              )}
            </div>

            {latestEpisode && (
              <Link
                href={`/tonton/${latestEpisode.episodeId}`}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors shadow-lg shadow-purple-600/30"
              >
                <Play className="w-4 h-4 fill-white" />
                Tonton Episode Terbaru
              </Link>
            )}
          </div>
        </div>

        {anime.synopsis && (
          <div className="bg-[hsl(222,47%,8%)] rounded-2xl p-5 border border-purple-900/20">
            <h2 className="text-sm font-semibold text-white mb-3">Sinopsis</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{anime.synopsis}</p>
          </div>
        )}

        {episodes.length > 0 && (
          <div className="bg-[hsl(222,47%,8%)] rounded-2xl border border-purple-900/20 overflow-hidden">
            <div className="px-5 py-4 border-b border-purple-900/20 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                Daftar Episode ({episodes.length})
              </h2>
            </div>
            <div className="divide-y divide-purple-900/10">
              {displayed.map((ep) => (
                <Link
                  key={ep.episodeId}
                  href={`/tonton/${ep.episodeId}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-purple-900/20 transition-colors group"
                >
                  <div>
                    <p className="text-sm text-gray-200 group-hover:text-white transition-colors line-clamp-1">
                      {ep.title}
                    </p>
                    {ep.date && (
                      <p className="text-xs text-gray-500 mt-0.5">{ep.date}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-purple-400 font-medium">Tonton</span>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
            {episodes.length > 20 && (
              <div className="px-5 py-4 border-t border-purple-900/20">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full text-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {showAll ? "Tampilkan Lebih Sedikit" : `Tampilkan Semua (${episodes.length - 20} episode lagi)`}
                </button>
              </div>
            )}
          </div>
        )}

        <AdBanner position="bottom" />
      </div>
    </div>
  );
}
