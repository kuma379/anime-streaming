import { useAnimeBatch } from "@workspace/api-client-react";
import { AnimeCard } from "@/components/anime-card";
import { GridSkeleton, ErrorState, EmptyState } from "@/components/ui/skeletons";

export default function BatchPage() {
  const { data: rawData, isLoading, isError, refetch } = useAnimeBatch();
  const batchList: any[] = (rawData as any)?.data?.batchList || [];

  if (isLoading) return <div className="container mx-auto px-4 py-10"><GridSkeleton count={18} /></div>;
  if (isError) return <ErrorState title="Failed to load" message="Could not load batch downloads." onRetry={refetch} />;

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-black">Batch Downloads</h1>
        <p className="text-muted-foreground">Download full series in one go</p>
      </div>
      {batchList.length === 0 ? (
        <EmptyState title="No batches found" message="No batch downloads available right now." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {batchList.map((anime: any) => (
            <AnimeCard key={anime.animeId || anime.href} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
}
