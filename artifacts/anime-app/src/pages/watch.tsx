import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Play, Monitor } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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

  // Flatten all servers across all qualities into a numbered list
  const allServers: { serverId: string; quality: string; label: string }[] = [];
  if (episode?.server?.qualities) {
    let count = 1;
    for (const q of episode.server.qualities) {
      if (!q.serverList?.length) continue;
      for (const s of q.serverList) {
        allServers.push({ serverId: s.serverId, quality: q.title, label: `Server ${count}` });
        count++;
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 max-w-5xl mx-auto">
        <Skeleton className="w-full aspect-video rounded-xl" />
        <Skeleton className="h-6 w-2/3" />
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />)}
        </div>
      </div>
    );
  }

  if (isError || !episode) {
    return <ErrorState title="Episode tidak ditemukan" message="Tidak dapat memuat episode ini." onRetry={refetch} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <Link href={`/anime/${animeSlug}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="w-4 h-4" /> Kembali ke Anime
        </Link>
        {episode.hasPrevEpisode && episode.prevEpisode && (
          <Link href={`/watch/${episode.prevEpisode}`}>
            <Button variant="outline" size="sm" className="gap-1 rounded-full">
              <ChevronLeft className="w-4 h-4" /> Sebelumnya
            </Button>
          </Link>
        )}
        {episode.hasNextEpisode && episode.nextEpisode && (
          <Link href={`/watch/${episode.nextEpisode}`}>
            <Button variant="outline" size="sm" className="gap-1 rounded-full">
              Selanjutnya <ChevronRight className="w-4 h-4" />
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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Monitor className="w-14 h-14 opacity-20" />
            <p className="text-sm">Pilih server di bawah untuk mulai menonton</p>
          </div>
        )}
        {serverLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {allServers.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Play className="w-3.5 h-3.5" /> Pilih Server
          </p>
          <div className="flex flex-wrap gap-2">
            {allServers.map((server) => (
              <button
                key={server.serverId}
                onClick={() => handleServerSelect(server.serverId)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  selectedServerId === server.serverId
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30 scale-105"
                    : "bg-muted/40 border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {server.label}
                <span className="ml-1.5 text-[10px] opacity-60 uppercase">{server.quality}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
