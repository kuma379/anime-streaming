import { useAnimeGenres } from "@workspace/api-client-react";
import { ErrorState, EmptyState } from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function GenresPage() {
  const { data: rawData, isLoading, isError, refetch } = useAnimeGenres();
  const genreList: any[] = (rawData as any)?.data?.genreList || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 20 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) return <ErrorState title="Failed to load genres" message="Could not load genre list." onRetry={refetch} />;
  if (!genreList.length) return <EmptyState title="No genres" message="No genres available." />;

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-black">Browse by Genre</h1>
        <p className="text-muted-foreground">Find anime by your favorite genre</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {genreList.map((genre: any) => (
          <Link key={genre.genreId} href={`/genres/${genre.genreId}`}>
            <div className="group flex items-center justify-center h-12 px-4 rounded-xl border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 cursor-pointer font-medium text-sm text-center">
              {genre.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
