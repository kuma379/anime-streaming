import { Link } from "wouter";
import { Play, Star } from "lucide-react";
import { type AnimeItem } from "@/lib/api";

interface AnimeCardProps {
  anime: AnimeItem;
  variant?: "default" | "small";
}

export function AnimeCard({ anime, variant = "default" }: AnimeCardProps) {
  const href = anime.slug
    ? `/tonton/${anime.slug}`
    : "#";

  if (variant === "small") {
    return (
      <Link href={href} className="flex gap-3 group">
        <div className="relative w-16 h-20 flex-shrink-0 rounded-md overflow-hidden bg-[hsl(222,47%,12%)]">
          {anime.poster ? (
            <img
              src={anime.poster}
              alt={anime.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="w-4 h-4 text-purple-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors line-clamp-2">
            {anime.title}
          </p>
          {anime.episode && (
            <p className="text-xs text-gray-400 mt-1">{anime.episode}</p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[hsl(222,47%,12%)] mb-2">
        {anime.poster ? (
          <img
            src={anime.poster}
            alt={anime.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-8 h-8 text-purple-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mx-auto">
              <Play className="w-4 h-4 fill-white text-white" />
            </div>
          </div>
        </div>
        {anime.episode && (
          <div className="absolute top-2 left-2">
            <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-medium">
              {anime.episode}
            </span>
          </div>
        )}
        {anime.type && (
          <div className="absolute top-2 right-2">
            <span className="text-xs bg-black/60 text-gray-300 px-2 py-0.5 rounded-full border border-white/10">
              {anime.type}
            </span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-200 group-hover:text-purple-400 transition-colors line-clamp-2">
        {anime.title}
      </h3>
      {anime.rating && (
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-gray-400">{anime.rating}</span>
        </div>
      )}
    </Link>
  );
}
