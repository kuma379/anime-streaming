import { useAnimeSchedule } from "@workspace/api-client-react";
import { AnimeCard } from "@/components/anime-card";
import { ErrorState, EmptyState } from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function SchedulePage() {
  const { data: rawData, isLoading, isError, refetch } = useAnimeSchedule();
  const days: any[] = (rawData as any)?.data?.days || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 space-y-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="aspect-[3/4] rounded-lg" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) return <ErrorState title="Failed to load schedule" message="Could not load the airing schedule." onRetry={refetch} />;
  if (!days.length) return <EmptyState title="No schedule" message="No schedule data available." />;

  return (
    <div className="container mx-auto px-4 py-10 space-y-2">
      <div className="space-y-1 mb-10">
        <h1 className="text-3xl font-display font-black">Airing Schedule</h1>
        <p className="text-muted-foreground">Weekly anime release calendar</p>
      </div>
      <div className="space-y-12">
        {days.map((day: any) => (
          <section key={day.day} className="space-y-6">
            <h2 className="text-xl font-display font-bold border-l-4 border-primary pl-4">{day.day}</h2>
            {day.animeList?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                {day.animeList.map((anime: any) => (
                  <AnimeCard key={anime.animeId || anime.href} anime={anime} showScore={false} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm pl-4">No anime airing on this day.</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
