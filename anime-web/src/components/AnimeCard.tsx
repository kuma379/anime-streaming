import { Link } from "wouter";
import { Play, Star } from "lucide-react";
import type { AnimeItem } from "@/lib/api";

interface Props {
  anime: AnimeItem;
  episodeMode?: boolean;
}

export function AnimeCard({ anime, episodeMode = false }: Props) {
  const slug = anime.slug || "";
  const href = episodeMode ? `/tonton/${slug}` : `/anime/${slug}`;

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[hsl(222,47%,12%)] mb-2">
        {anime.poster ? (
          <img
            src={anime.poster}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-8 h-8 text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-purple-600/90 rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
        {anime.episode && (
          <div className="absolute top-2 left-2">
            <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded font-medium">
              {anime.episode}
            </span>
          </div>
        )}
        {anime.type && (
          <div className="absolute top-2 right-2">
            <span className="text-xs bg-black/60 text-gray-300 px-2 py-0.5 rounded">
              {anime.type}
            </span>
          </div>
        )}
        {anime.rating && (
          <div className="absolute bottom-2 left-2 flex items-center gap-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-white font-medium">{anime.rating}</span>
          </div>
        )}
      </div>
      <h3 className="text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-2 font-medium leading-snug">
        {anime.title}
      </h3>
      {anime.releaseDay && (
        <p className="text-xs text-gray-500 mt-0.5">{anime.releaseDay}</p>
      )}
    </Link>
  );
}
