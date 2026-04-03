import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, ExternalLink, Play, Monitor } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/skeletons";

interface Props {
  params: { episodeId: string };
}

function useEpisode(episodeId: string) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

  const load = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await fetch(`${BASE_URL}/api/anime/episode/${encodeURIComponent(episodeId)}`);
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useState(() => { load(); });

  return { data, isLoading, isError, refetch: load };
}

function useServer(serverId: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

  const fetch_ = async (id: string) => {
    setLoading(true);
    setUrl(null);
    try {
      const res = await fetch(`${BASE_URL}/api/anime/server/${encodeURIComponent(id)}`);
      const json = await res.json();
      const streamUrl = json?.data?.url || json?.data?.streamingUrl || json?.data?.iframe || null;
      setUrl(streamUrl);
    } catch {
      setUrl(null);
    } finally {
      setLoading(false);
    }
  };

  return { url, loading, fetchServer: fetch_ };
}

export default function WatchPage({ params }: Props) {
  const { episodeId } = params;
  const { data: rawData, isLoading, isError, refetch } = useEpisode(episodeId);
  const episode = rawData?.data;
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [serverLoading, setServerLoading] = useState(false);

  const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

  const handleServerSelect = async (serverId: string) => {
    setSelectedServerId(serverId);
    setServerLoading(true);
    setStreamUrl(null);
    try {
      const res = await fetch(`${BASE_URL}/api/anime/server/${encodeURIComponent(serverId)}`);
      const json = await res.json();
      const url = json?.data?.url || json?.data?.streamingUrl || json?.data?.iframe || null;
      setStreamUrl(url);
    } catch {
      setStreamUrl(null);
    } finally {
      setServerLoading(false);
    }
  };

  const animeSlug = episode?.animeId || episodeId.replace(/-episode-\d+$/, "");
  const defaultUrl = episode?.defaultStreamingUrl || null;
  const activeUrl = streamUrl || defaultUrl;

  const qualities: any[] = episode?.server?.qualities?.filter((q: any) => q.serverList?.length > 0) || [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 max-w-5xl mx-auto">
        <Skeleton className="w-full aspect-video rounded-xl" />
        <Skeleton className="h-6 w-2/3" />
        <div className="flex gap-2 flex-wrap">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-9 w-24 rounded-full" />)}
        </div>
      </div>
    );
  }

  if (isError || !episode) {
    return <ErrorState title="Episode not found" message="Could not load this episode." onRetry={refetch} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Link href={`/anime/${animeSlug}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Anime
        </Link>
        {episode.hasPrevEpisode && episode.prevEpisode && (
          <Link href={`/watch/${episode.prevEpisode}`}>
            <Button variant="outline" size="sm" className="gap-1 rounded-full">
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
          </Link>
        )}
        {episode.hasNextEpisode && episode.nextEpisode && (
          <Link href={`/watch/${episode.nextEpisode}`}>
            <Button variant="outline" size="sm" className="gap-1 rounded-full">
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>

      <div>
        <h1 className="text-xl md:text-2xl font-display font-black leading-tight">{episode.title}</h1>
        {episode.releasedOn && <p className="text-sm text-muted-foreground mt-1">{episode.releasedOn}</p>}
      </div>

      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-black/60 border border-border/20">
        {activeUrl ? (
          <iframe
            src={activeUrl}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            frameBorder="0"
            title={episode.title}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Monitor className="w-16 h-16 opacity-20" />
            <p className="text-sm">Select a server below to start watching</p>
          </div>
        )}
        {serverLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {qualities.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Play className="w-4 h-4" /> Select Server
          </p>
          <div className="flex flex-wrap gap-2">
            {qualities.map((quality: any) =>
              quality.serverList.map((server: any) => (
                <button
                  key={server.serverId}
                  onClick={() => handleServerSelect(server.serverId)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                    selectedServerId === server.serverId
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30"
                      : "bg-muted/40 border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {server.title}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {episode.downloadUrl?.formats?.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-border/30">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Download</p>
          <div className="grid gap-3">
            {episode.downloadUrl.formats.map((fmt: any) => (
              <div key={fmt.title} className="space-y-2">
                <p className="text-xs font-bold uppercase text-muted-foreground/70">{fmt.title}</p>
                <div className="flex flex-wrap gap-2">
                  {fmt.qualities?.map((q: any) =>
                    q.urls?.slice(0, 3).map((u: any) => (
                      <a
                        key={u.url}
                        href={u.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/40 border border-border/40 text-xs font-medium hover:bg-muted hover:border-primary/40 transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {q.title?.trim()} — {u.title?.trim()}
                      </a>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
