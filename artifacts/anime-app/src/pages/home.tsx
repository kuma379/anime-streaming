import { useAnimeHome } from "@workspace/api-client-react";
import { AnimeCard } from "@/components/anime-card";
import { GridSkeleton, HeroSkeleton, ErrorState } from "@/components/ui/skeletons";
import { AnimeApiResponse } from "@/lib/types";
import { PlayCircle, ArrowRight, TrendingUp, Clock, Flame } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: rawData, isLoading, isError, refetch } = useAnimeHome();
  const data = rawData as unknown as AnimeApiResponse;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-12 pb-12">
        <HeroSkeleton />
        <div className="container mx-auto px-4 space-y-12">
          <div className="space-y-6">
            <div className="h-8 w-48 bg-muted rounded-md animate-pulse"></div>
            <GridSkeleton count={6} />
          </div>
          <div className="space-y-6">
            <div className="h-8 w-48 bg-muted rounded-md animate-pulse"></div>
            <GridSkeleton count={6} />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <ErrorState 
        title="Failed to load anime" 
        message="We couldn't reach the Samehadaku servers. Please try again later."
        onRetry={refetch}
      />
    );
  }

  const { recent, popular, ongoing } = data.data;

  // Use the first popular anime as the hero
  const heroAnime = popular?.animeList?.[0] || recent?.animeList?.[0];
  const heroId = heroAnime?.animeId || (heroAnime?.href ? heroAnime.href.split('/').filter(Boolean).pop() : '');

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      {heroAnime && (
        <div className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden group">
          <div className="absolute inset-0">
            <img 
              src={heroAnime.poster} 
              alt={heroAnime.title} 
              className="w-full h-full object-cover object-top scale-105 transition-transform duration-[20s] ease-out group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-end pb-16 md:pb-24">
            <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-bold tracking-wide uppercase border border-primary/20 backdrop-blur-md">
                  <Flame className="w-4 h-4" /> #1 Trending
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium border border-white/10 backdrop-blur-md">
                  {heroAnime.type || "TV"}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white leading-tight text-balance drop-shadow-lg">
                {heroAnime.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white/80 font-medium">
                {heroAnime.score && (
                  <div className="flex items-center gap-1.5 text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-lg">{heroAnime.score}</span>
                  </div>
                )}
                {heroAnime.status && (
                  <span className="text-sm uppercase tracking-wider">{heroAnime.status}</span>
                )}
                {heroAnime.episodes && (
                  <span className="text-sm">{heroAnime.episodes}</span>
                )}
              </div>
              
              <div className="flex items-center gap-4 pt-4">
                <Link href={`/anime/${heroId}`}>
                  <Button size="lg" className="rounded-full px-8 font-bold text-base h-14 gap-2 shadow-lg hover:scale-105 transition-transform">
                    <PlayCircle className="w-5 h-5" /> Start Watching
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 space-y-20">
        {/* Recent Section */}
        {recent?.animeList?.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary">
                  <Clock className="w-5 h-5" />
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Recently Updated</h2>
                </div>
                <p className="text-muted-foreground">The latest episodes just dropped</p>
              </div>
              <Link href="/ongoing" className="hidden sm:flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {recent.animeList.slice(0, 12).map((anime: any) => (
                <AnimeCard key={anime.animeId || anime.href} anime={anime} />
              ))}
            </div>
          </section>
        )}

        {/* Popular Section */}
        {popular?.animeList?.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp className="w-5 h-5" />
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Popular Now</h2>
                </div>
                <p className="text-muted-foreground">What everyone is watching</p>
              </div>
              <Link href="/popular" className="hidden sm:flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {popular.animeList.slice(0, 6).map((anime: any) => (
                <AnimeCard key={anime.animeId || anime.href} anime={anime} />
              ))}
            </div>
          </section>
        )}

        {/* Ongoing Section */}
        {ongoing?.animeList?.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary">
                  <PlayCircle className="w-5 h-5" />
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Ongoing Series</h2>
                </div>
                <p className="text-muted-foreground">Catch up on airing shows</p>
              </div>
              <Link href="/ongoing" className="hidden sm:flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {ongoing.animeList.slice(0, 6).map((anime: any) => (
                <AnimeCard key={anime.animeId || anime.href} anime={anime} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Temporary Star icon for local use since I can't import easily
function Star(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
