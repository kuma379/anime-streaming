import { useAnimeCompleted } from "@workspace/api-client-react";
import { AnimeCard } from "@/components/anime-card";
import { GridSkeleton, ErrorState, EmptyState } from "@/components/ui/skeletons";

export default function CompletedPage() {
  const { data: rawData, isLoading, isError, refetch } = useAnimeCompleted();
  const animeList = (rawData as any)?.data?.animeList || [];

  if (isLoading) return <div className="container mx-auto px-4 py-10"><GridSkeleton count={18} /></div>;
  if (isError) return <ErrorState title="Failed to load" message="Could not load completed anime." onRetry={refetch} />;

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-black">Completed Anime</h1>
        <p className="text-muted-foreground">Finished series you can binge start to end</p>
      </div>
      {animeList.length === 0 ? (
        <EmptyState title="No anime found" message="No completed anime listed right now." />
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
