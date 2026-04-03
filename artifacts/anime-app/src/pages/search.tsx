import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAnimeSearch } from "@workspace/api-client-react";
import { AnimeCard } from "@/components/anime-card";
import { GridSkeleton, ErrorState, EmptyState } from "@/components/ui/skeletons";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const initialQ = params.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const [submitted, setSubmitted] = useState(initialQ);

  const { data: rawData, isLoading, isError, refetch } = useAnimeSearch(
    { params: { q: submitted } },
    { query: { enabled: !!submitted } }
  );
  const animeList = (rawData as any)?.data?.animeList || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSubmitted(query.trim());
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  useEffect(() => {
    setQuery(initialQ);
    setSubmitted(initialQ);
  }, [initialQ]);

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-display font-black">Search Anime</h1>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for an anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-14 text-base rounded-full bg-muted/60 border-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </form>
      </div>

      {submitted && (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Results for <span className="font-bold text-foreground">"{submitted}"</span>
          </p>
          {isLoading && <GridSkeleton count={12} />}
          {isError && (
            <ErrorState
              title="Search failed"
              message="Could not retrieve results. Please try again."
              onRetry={refetch}
            />
          )}
          {!isLoading && !isError && animeList.length === 0 && (
            <EmptyState title="No results found" message={`No anime found for "${submitted}". Try a different keyword.`} />
          )}
          {!isLoading && !isError && animeList.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {animeList.map((anime: any) => (
                <AnimeCard key={anime.animeId || anime.href} anime={anime} />
              ))}
            </div>
          )}
        </div>
      )}

      {!submitted && (
        <EmptyState title="Start searching" message="Type an anime name above and hit enter." />
      )}
    </div>
  );
}
