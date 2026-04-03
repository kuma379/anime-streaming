import { useAnimeDetail } from "@workspace/api-client-react";
import { ErrorState } from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ChevronLeft, Star, Users, Calendar } from "lucide-react";

interface Props {
  params: { slug: string };
}

export default function AnimeDetailPage({ params }: Props) {
  const { slug } = params;
  const { data: rawData, isLoading, isError, refetch } = useAnimeDetail(slug);
  const anime = (rawData as any)?.data;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-full md:w-72 shrink-0 aspect-[3/4] rounded-2xl" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !anime) {
    return <ErrorState title="Anime not found" message="Could not load this anime's details." onRetry={refetch} />;
  }

  const genres: any[] = anime.genres || [];
  const score = anime.score?.value || anime.score || null;
  const users = anime.score?.users || null;

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </Link>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <div className="shrink-0 w-full max-w-[220px] mx-auto md:mx-0">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
            <img
              src={anime.poster}
              alt={anime.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-display font-black leading-tight">{anime.title}</h1>

            <div className="flex flex-wrap gap-2 items-center">
              {anime.type && <Badge variant="secondary" className="font-bold uppercase tracking-wide">{anime.type}</Badge>}
              {anime.status && (
                <Badge variant={anime.status === "Completed" ? "default" : "outline"} className="font-bold uppercase tracking-wide">
                  {anime.status}
                </Badge>
              )}
              {genres.slice(0, 5).map((g: any) => (
                <Link key={g.genreId} href={`/genres/${g.genreId}`}>
                  <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer capitalize">
                    {g.title}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            {score && (
              <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-3 py-2 rounded-xl font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-lg">{score}</span>
                {users && <span className="text-xs text-muted-foreground font-normal">({users} users)</span>}
              </div>
            )}
            {anime.episodes && !Array.isArray(anime.episodes) && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{anime.episodes} episodes</span>
              </div>
            )}
          </div>

          {anime.synopsis && (
            <div className="space-y-2">
              <h2 className="font-display font-bold text-lg">Synopsis</h2>
              <p className="text-muted-foreground leading-relaxed text-[15px]">{anime.synopsis}</p>
            </div>
          )}

          {Array.isArray(anime.episodes) && anime.episodes.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-display font-bold text-lg">Episodes</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {anime.episodes.slice(0, 24).map((ep: any, i: number) => (
                  <div key={i} className="flex items-center justify-center h-10 rounded-lg bg-muted text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                    {ep.episode || ep.title || `Ep ${i + 1}`}
                  </div>
                ))}
              </div>
              {anime.episodes.length > 24 && (
                <p className="text-xs text-muted-foreground">+{anime.episodes.length - 24} more episodes</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
