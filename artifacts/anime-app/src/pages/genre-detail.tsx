import { useAnimeByGenre } from "@workspace/api-client-react";
import { AnimeCard } from "@/components/anime-card";
import { GridSkeleton, ErrorState, EmptyState } from "@/components/ui/skeletons";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

interface Props {
  params: { genre: string };
}

export default function GenreDetailPage({ params }: Props) {
  const { genre } = params;
  const { data: rawData, isLoading, isError, refetch } = useAnimeByGenre(genre);
  const animeList: any[] = (rawData as any)?.data?.animeList || [];

  const displayName = genre.charAt(0).toUpperCase() + genre.slice(1);

  if (isLoading) return <div className="container mx-auto px-4 py-10"><GridSkeleton count={18} /></div>;
  if (isError) return <ErrorState title="Failed to load" message={`Could not load ${displayName} anime.`} onRetry={refetch} />;

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <Link href="/genres" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-2">
          <ChevronLeft className="w-4 h-4" /> All Genres
        </Link>
        <h1 className="text-3xl font-display font-black capitalize">{displayName}</h1>
        <p className="text-muted-foreground">{animeList.length} anime in this genre</p>
      </div>
      {animeList.length === 0 ? (
        <EmptyState title="No anime found" message={`No anime found in the ${displayName} genre.`} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {animeList.map((anime: any) => (
            <AnimeCard key={anime.animeId || anime.href} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
}
