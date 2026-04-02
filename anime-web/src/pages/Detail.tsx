import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import {
  ArrowLeft, Star, Play, Loader2, AlertCircle,
  Calendar, Clock, Tv, Users, Film
} from "lucide-react";
import { fetchAnimeDetail, type AnimeDetail, type AnimeItem } from "@/lib/api";
import { AnimeCard } from "@/components/AnimeCard";
import { AdBanner } from "@/components/AdBanner";

export default function Detail() {
  const params = useParams<{ animeId: string }>();
  const animeId = params?.animeId || "";

  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!animeId) return;
    setLoading(true);
    setError(null);
    fetchAnimeDetail(animeId)
      .then(setAnime)
      .catch(() => setError("Gagal memuat data anime. Coba lagi."))
      .finally(() => setLoading(false));
  }, [animeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(222,47%,5%)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Memuat anime...</p>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-[hsl(222,47%,5%)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-gray-300 mb-4">{error || "Anime tidak ditemukan"}</p>
          <Link href="/" className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full text-sm transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const sortedEpisodes = [...anime.episodeList].sort((a, b) => b.eps - a.eps);
  const latestEp = sortedEpisodes[0];

  return (
    <div className="min-h-screen bg-[hsl(222,47%,5%)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm w-fit">
          <ArrowLeft className="w-4 h-4" />
          Beranda
        </Link>

        <AdBanner position="top" />

        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0">
            <div className="w-48 md:w-56 mx-auto md:mx-0">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[hsl(222,47%,12%)] shadow-2xl shadow-purple-900/30">
                {anime.poster ? (
                  <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="w-12 h-12 text-gray-600" />
                  </div>
                )}
              </div>
              {latestEp && (
                <Link
                  href={`/tonton/${latestEp.episodeId}`}
                  className="mt-4 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-colors w-full shadow-lg shadow-purple-600/30"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Tonton Episode {latestEp.eps}
                </Link>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{anime.title}</h1>
            {anime.japanese && (
              <p className="text-gray-500 text-sm mb-4">{anime.japanese}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-5">
              {anime.genreList?.map((g) => (
                <span key={g.title || g.slug} className="text-xs bg-purple-600/20 text-purple-300 border border-purple-600/30 px-3 py-1 rounded-full">
                  {g.title}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {anime.score && (
                <div className="flex items-center gap-2 bg-[hsl(222,47%,10%)] rounded-xl px-3 py-2.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Skor</p>
                    <p className="text-sm font-semibold text-white">{anime.score}</p>
                  </div>
                </div>
              )}
              {anime.type && (
                <div className="flex items-center gap-2 bg-[hsl(222,47%,10%)] rounded-xl px-3 py-2.5">
                  <Tv className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Tipe</p>
                    <p className="text-sm font-semibold text-white">{anime.type}</p>
                  </div>
                </div>
              )}
              {anime.status && (
                <div className="flex items-center gap-2 bg-[hsl(222,47%,10%)] rounded-xl px-3 py-2.5">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${anime.status.toLowerCase().includes("ongoing") || anime.status.toLowerCase().includes("airing") ? "bg-green-400" : "bg-gray-500"}`} />
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-sm font-semibold text-white">{anime.status}</p>
                  </div>
                </div>
              )}
              {anime.aired && (
                <div className="flex items-center gap-2 bg-[hsl(222,47%,10%)] rounded-xl px-3 py-2.5">
                  <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Tayang</p>
                    <p className="text-sm font-semibold text-white">{anime.aired}</p>
                  </div>
                </div>
              )}
              {anime.duration && (
                <div className="flex items-center gap-2 bg-[hsl(222,47%,10%)] rounded-xl px-3 py-2.5">
                  <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Durasi</p>
                    <p className="text-sm font-semibold text-white">{anime.duration}</p>
                  </div>
                </div>
              )}
              {anime.studios && (
                <div className="flex items-center gap-2 bg-[hsl(222,47%,10%)] rounded-xl px-3 py-2.5">
                  <Users className="w-4 h-4 text-green-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Studio</p>
                    <p className="text-sm font-semibold text-white truncate">{anime.studios}</p>
                  </div>
                </div>
              )}
            </div>

            {anime.synopsis && (
              <div>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Sinopsis</h2>
                <p className="text-gray-300 text-sm leading-relaxed">{anime.synopsis}</p>
              </div>
            )}
          </div>
        </div>

        {sortedEpisodes.length > 0 && (
          <div className="bg-[hsl(222,47%,8%)] rounded-2xl p-5 border border-purple-900/20">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Play className="w-4 h-4 text-purple-400" />
              Daftar Episode ({sortedEpisodes.length} eps)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
              {sortedEpisodes.map((ep) => (
                <Link
                  key={ep.episodeId}
                  href={`/tonton/${ep.episodeId}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(222,47%,12%)] hover:bg-purple-900/30 hover:border-purple-600/40 border border-transparent transition-all group"
                >
                  <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-purple-600/40 transition-colors">
                    <span className="text-xs font-bold text-purple-400">{ep.eps}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-300 group-hover:text-white truncate transition-colors">
                      Episode {ep.eps}
                    </p>
                    {ep.date && (
                      <p className="text-xs text-gray-600">{ep.date}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {anime.recommended.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-white mb-4">Rekomendasi</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {anime.recommended.slice(0, 6).map((a, i) => (
                <AnimeCard key={i} anime={a as AnimeItem} />
              ))}
            </div>
          </div>
        )}

        <AdBanner position="bottom" />
      </div>
    </div>
  );
}
