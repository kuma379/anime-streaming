import { useAnimeDetail } from "@workspace/api-client-react";
import { ErrorState } from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ChevronLeft, Star, Calendar, Play, Film, Tv } from "lucide-react";

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
          <Skeleton className="w-full md:w-60 shrink-0 aspect-[3/4] rounded-2xl" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !anime) {
    return <ErrorState title="Anime not found" message="Could not load this anime's details." onRetry={refetch} />;
  }

  const genreList: any[] = anime.genreList || anime.genres || [];
  const episodeList: any[] = anime.episodeList || [];
  const synopsis = typeof anime.synopsis === "string"
    ? anime.synopsis
    : Array.isArray(anime.synopsis?.paragraphs)
    ? anime.synopsis.paragraphs.join("\n\n")
    : null;

  const score = typeof anime.score === "object" ? anime.score?.value : anime.score;
  const users = typeof anime.score === "object" ? anime.score?.users : null;

  const title = anime.title || anime.english || anime.japanese || slug;

  const infos = [
    anime.type && { label: "Tipe", value: anime.type },
    anime.status && { label: "Status", value: anime.status },
    anime.season && { label: "Season", value: anime.season },
    anime.studios && { label: "Studio", value: anime.studios },
    anime.source && { label: "Source", value: anime.source },
    anime.duration && { label: "Durasi", value: anime.duration },
    anime.aired && { label: "Tayang", value: anime.aired },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ChevronLeft className="w-4 h-4" /> Kembali
      </Link>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <div className="shrink-0 w-full max-w-[200px] mx-auto md:mx-0">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-border/20">
            <img src={anime.poster} alt={title} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-black leading-tight">{title}</h1>
            {anime.japanese && anime.japanese !== title && (
              <p className="text-muted-foreground text-sm">{anime.japanese}</p>
            )}

            <div className="flex flex-wrap gap-2 items-center">
              {genreList.slice(0, 6).map((g: any) => (
                <Link key={g.genreId} href={`/genres/${g.genreId}`}>
                  <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer capitalize text-xs">
                    {g.title}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            {score && (
              <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-3 py-2 rounded-xl font-bold border border-yellow-500/20">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-lg">{score}</span>
                {users && <span className="text-xs text-muted-foreground font-normal">({users} pengguna)</span>}
              </div>
            )}
          </div>

          {infos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {infos.map((info) => (
                <div key={info.label} className="space-y-0.5">
                  <p className="text-xs text-muted-foreground/60 uppercase tracking-wider">{info.label}</p>
                  <p className="text-sm font-medium">{info.value}</p>
                </div>
              ))}
            </div>
          )}

          {synopsis && (
            <div className="space-y-2">
              <h2 className="font-display font-bold text-base uppercase tracking-wider text-muted-foreground/70">Sinopsis</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">{synopsis}</p>
            </div>
          )}
        </div>
      </div>

      {episodeList.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border/30">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-xl">Episode ({episodeList.length})</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {episodeList.map((ep: any) => (
              <Link key={ep.episodeId} href={`/watch/${ep.episodeId}`}>
                <div className="flex items-center justify-center h-11 rounded-xl bg-muted/40 border border-border/30 text-sm font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 cursor-pointer shadow-sm">
                  Ep {ep.title || ep.episode || "?"}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {anime.batchList?.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border/30">
          <h2 className="font-display font-bold text-xl flex items-center gap-2">
            <Film className="w-5 h-5 text-primary" /> Batch Download
          </h2>
          <div className="flex flex-wrap gap-2">
            {anime.batchList.map((b: any) => (
              <a
                key={b.href}
                href={b.samehadakuUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-muted/40 border border-border/30 text-sm font-medium hover:bg-muted hover:border-primary/40 transition-all"
              >
                {b.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
