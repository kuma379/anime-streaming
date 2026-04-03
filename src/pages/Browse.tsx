import { useEffect, useState, useCallback } from "react";
import { Link, useSearch, useLocation } from "wouter";
import { Search, Loader2, ChevronLeft, ChevronRight, Filter, Film, TrendingUp } from "lucide-react";

const GENRES = [
  { id: "shounen", label: "Shounen" },
  { id: "action", label: "Action" },
  { id: "adventure", label: "Adventure" },
  { id: "romance", label: "Romance" },
  { id: "comedy", label: "Comedy" },
  { id: "fantasy", label: "Fantasy" },
  { id: "supernatural", label: "Supernatural" },
  { id: "mystery", label: "Mystery" },
  { id: "horror", label: "Horror" },
  { id: "sci-fi", label: "Sci-Fi" },
  { id: "drama", label: "Drama" },
  { id: "historical", label: "Historical" },
  { id: "military", label: "Military" },
  { id: "sports", label: "Sports" },
  { id: "mecha", label: "Mecha" },
  { id: "magic", label: "Magic" },
  { id: "psychological", label: "Psychological" },
  { id: "slice-of-life", label: "Slice of Life" },
  { id: "school", label: "School" },
  { id: "harem", label: "Harem" },
  { id: "ecchi", label: "Ecchi" },
  { id: "vampire", label: "Vampire" },
  { id: "super-power", label: "Super Power" },
  { id: "martial-arts", label: "Martial Arts" },
];

interface AnimeCard {
  title: string;
  slug: string;
  poster: string;
  score?: string;
  episodes?: number | null;
  studios?: string;
  season?: string;
}

function AnimeGrid({ items }: { items: AnimeCard[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((anime) => (
        <Link key={anime.slug} href={`/anime/${anime.slug}`}>
          <div className="group cursor-pointer">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[hsl(222,47%,12%)] mb-2">
              {anime.poster ? (
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="w-8 h-8 text-gray-600" />
                </div>
              )}
              {anime.score && (
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-yellow-400 text-xs px-1.5 py-0.5 rounded font-medium">
                  ★ {anime.score}
                </div>
              )}
            </div>
            <h3 className="text-white text-xs font-medium line-clamp-2 group-hover:text-purple-400 transition-colors">
              {anime.title}
            </h3>
            {anime.season && (
              <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{anime.season}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Browse() {
  const searchStr = useSearch();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(searchStr);
  const urlQuery = params.get("q") || "";
  const urlGenre = params.get("genre") || "shounen";
  const urlPage = parseInt(params.get("page") || "1", 10);

  const [searchInput, setSearchInput] = useState(urlQuery);
  const [results, setResults] = useState<AnimeCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"search" | "genre">(urlQuery ? "search" : "genre");
  const [activeGenre, setActiveGenre] = useState(urlGenre);
  const [page, setPage] = useState(urlPage);

  const loadGenre = useCallback(async (genre: string, p: number) => {
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch(`/api/anime/genre?genre=${genre}&page=${p}`);
      const data = await res.json();
      setResults(data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch(`/api/anime/genre?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (urlQuery) {
      setMode("search");
      setSearchInput(urlQuery);
      doSearch(urlQuery);
    } else {
      setMode("genre");
      setActiveGenre(urlGenre);
      setPage(urlPage);
      loadGenre(urlGenre, urlPage);
    }
  }, [urlQuery, urlGenre, urlPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    navigate(`/cari?q=${encodeURIComponent(searchInput.trim())}`);
  };

  const handleGenreClick = (genreId: string) => {
    navigate(`/cari?genre=${genreId}&page=1`);
  };

  const handlePage = (newPage: number) => {
    navigate(`/cari?genre=${activeGenre}&page=${newPage}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[hsl(222,47%,5%)] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            Cari Anime
          </h1>
          <p className="text-gray-400 text-sm">Temukan anime favorit kamu — termasuk anime lama dan klasik</p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[hsl(222,47%,12%)] rounded-xl px-4 py-3 border border-purple-900/30 focus-within:border-purple-600 transition-colors">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Cari: One Piece, Naruto, Bleach, Kimetsu, Jujutsu..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-transparent text-white placeholder-gray-500 outline-none w-full text-sm"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors"
            >
              Cari
            </button>
          </div>
        </form>

        {/* Genre Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-300">Browse by Genre</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g.id}
                onClick={() => handleGenreClick(g.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  mode === "genre" && activeGenre === g.id
                    ? "bg-purple-600 text-white border-purple-500"
                    : "bg-[hsl(222,47%,12%)] text-gray-400 border-purple-900/30 hover:border-purple-600/40 hover:text-white"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                {mode === "search" ? "Mencari anime..." : "Memuat genre..."}
              </p>
              {mode === "search" && (
                <p className="text-gray-500 text-xs mt-1">Mungkin membutuhkan waktu 10-20 detik untuk pencarian menyeluruh</p>
              )}
            </div>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">
                {mode === "search"
                  ? `${results.length} hasil untuk "${urlQuery}"`
                  : `${GENRES.find(g => g.id === activeGenre)?.label || activeGenre} — Halaman ${page}`}
              </p>
            </div>
            <AnimeGrid items={results} />
            {mode === "genre" && (
              <div className="flex justify-center items-center gap-3 mt-8">
                <button
                  onClick={() => handlePage(page - 1)}
                  disabled={page <= 1}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[hsl(222,47%,12%)] text-gray-400 rounded-lg hover:text-white hover:bg-purple-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
                >
                  <ChevronLeft className="w-4 h-4" /> Sebelumnya
                </button>
                <span className="text-gray-400 text-sm font-medium px-3">Halaman {page}</span>
                <button
                  onClick={() => handlePage(page + 1)}
                  disabled={results.length < 15}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[hsl(222,47%,12%)] text-gray-400 rounded-lg hover:text-white hover:bg-purple-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Selanjutnya <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : urlQuery || mode === "genre" ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400">
              {mode === "search" ? `Tidak ada hasil untuk "${urlQuery}"` : "Tidak ada anime di halaman ini"}
            </p>
            {mode === "search" && (
              <p className="text-gray-500 text-xs mt-2">Coba kata kunci lain atau browse by genre di atas</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
