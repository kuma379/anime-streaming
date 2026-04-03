import { AnimeListItem } from "@/lib/types";
import { Link } from "wouter";
import { Star, PlayCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AnimeCardProps {
  anime: AnimeListItem;
  showScore?: boolean;
}

export function AnimeCard({ anime, showScore = true }: AnimeCardProps) {
  // Try to use animeId for routing, fallback to href if necessary (but clean it up)
  const id = anime.animeId || (anime.href ? anime.href.split('/').filter(Boolean).pop() : '');
  const href = `/anime/${id}`;

  return (
    <Link href={href}>
      <div className="group relative flex flex-col gap-3 rounded-xl p-2 transition-all duration-300 hover:bg-muted/50 anime-card-hover cursor-pointer">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-sm">
          <img
            src={anime.poster}
            alt={anime.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <PlayCircle className="h-6 w-6" />
            </div>
          </div>

          <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end">
            {anime.type && (
              <Badge variant="secondary" className="bg-black/60 text-white hover:bg-black/60 border-none backdrop-blur-md text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
                {anime.type}
              </Badge>
            )}
            {anime.status && (
              <Badge variant="default" className="bg-primary text-primary-foreground border-none shadow-sm text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
                {anime.status}
              </Badge>
            )}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end">
            {anime.episodes && (
              <span className="text-xs font-medium text-white/90 drop-shadow-md">
                {anime.episodes}
              </span>
            )}
            {showScore && anime.score && (
              <div className="flex items-center gap-1 text-yellow-400 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-md">
                <Star className="h-3 w-3 fill-current" />
                <span className="text-xs font-bold text-white">{anime.score}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 px-1">
          <h3 className="line-clamp-2 text-sm font-bold leading-tight group-hover:text-primary transition-colors">
            {anime.title}
          </h3>
          {anime.releasedOn && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <Calendar className="h-3 w-3" />
              <span>{anime.releasedOn}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
