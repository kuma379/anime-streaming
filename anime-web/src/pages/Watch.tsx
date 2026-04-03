import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "wouter";
import {
  Play, ArrowLeft, ChevronRight, ChevronLeft, Monitor,
  AlertCircle, RefreshCw, Loader2, Zap, Signal, Wifi, ExternalLink
} from "lucide-react";
import { fetchEpisode, fetchServer, type EpisodeDetail, type EpisodeServer } from "@/lib/api";
import { AdBanner } from "@/components/AdBanner";
import { getServerPref } from "./Admin";

interface ActiveStream { url: string; key: string; }

function isEmbeddableServer(name: string): boolean {
  const embedServers = ["vidhide", "filedon", "filemoon", "streamtape", "doodstream", "mp4upload", "mega"];
  return embedServers.some((s) => name.toLowerCase().includes(s));
}

function isBlockedUrl(url: string): boolean {
  const blocked = ["desustream.info", "desuarchive.org", "desustorage.org"];
  return blocked.some((b) => url.includes(b));
}

function VideoPlayer({ stream }: { stream: ActiveStream | null }) {
  if (!stream) {
    return (
      <div className="w-full aspect-video bg-[hsl(222,47%,8%)] rounded-xl flex items-center justify-center border border-purple-900/20">
        <div className="text-center">
          <Monitor className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Pilih server di bawah untuk menonton</p>
        </div>
      </div>
    );
  }

  const isDirect = /\.(mp4|mkv|webm|m3u8)(\?|$)/i.test(stream.url);

  if (isDirect) {
    return (
      <div className="w-full rounded-xl overflow-hidden bg-black shadow-2xl shadow-purple-900/30">
        <video key={stream.url} controls autoPlay playsInline className="w-full aspect-video" src={stream.url}>
          Browser tidak mendukung video HTML5.
        </video>
      </div>
    );
  }

  if (isBlockedUrl(stream.url)) {
    return (
      <div className="w-full aspect-video bg-[hsl(222,47%,8%)] rounded-xl flex items-center justify-center border border-purple-900/20">
        <div className="text-center px-6">
          <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
          <p className="text-white font-semibold mb-1">Server ini tidak mendukung embed</p>
          <p className="text-gray-400 text-sm mb-4">Pilih server lain yang bertanda <span className="text-green-400 font-medium">embed</span> di bawah.</p>
          <a
            href={stream.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors border border-gray-700 rounded-lg px-3 py-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Buka di tab baru sebagai alternatif
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl overflow-hidden bg-black shadow-2xl shadow-purple-900/30">
      <iframe
        key={stream.url}
        src={stream.url}
        className="w-full aspect-video"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write"
        title="Stream Player"
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-pointer-lock"
        style={{ border: "none", display: "block" }}
      />
    </div>
  );
}

const QUALITY_COLORS: Record<string, string> = {
  "720p": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "480p": "bg-green-500/20 text-green-300 border-green-500/30",
  "360p": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "1080p": "bg-purple-500/20 text-purple-300 border-purple-500/30",
};
const SERVER_ICONS = [Zap, Signal, Wifi, Play, Monitor];

interface GroupedServers { quality: string; servers: EpisodeServer[]; }

function groupByQuality(servers: EpisodeServer[]): GroupedServers[] {
  const map: Record<string, EpisodeServer[]> = {};
  for (const s of servers) {
    const q = s.quality || "Lainnya";
    if (!map[q]) map[q] = [];
    map[q].push(s);
  }
  const ORDER = ["1080p", "720p", "480p", "360p", "Lainnya"];
  return ORDER.filter((q) => map[q]).map((q) => ({ quality: q, servers: map[q] }));
}

function findBestServer(groups: GroupedServers[], pref: ReturnType<typeof getServerPref>): EpisodeServer | null {
  const flatAll = groups.flatMap((g) => g.servers);
  const flatEmbed = flatAll.filter((s) => isEmbeddableServer(s.name));
  const prefGroup = groups.find((g) => g.quality === pref.defaultQuality) || groups[0];
  if (!prefGroup) return null;
  const embedInPrefGroup = prefGroup.servers.filter((s) => isEmbeddableServer(s.name));
  const byName = (list: EpisodeServer[]) =>
    list.find((s) => s.name.toLowerCase().includes(pref.preferredServer.toLowerCase()));
  return (
    byName(embedInPrefGroup) || embedInPrefGroup[0] ||
    byName(flatEmbed) || flatEmbed[0] ||
    byName(prefGroup.servers) || prefGroup.servers[0] || null
  );
}

export default function Watch() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";

  const [episode, setEpisode] = useState<EpisodeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStream, setActiveStream] = useState<ActiveStream | null>(null);
  const [serverLoading, setServerLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [activeServerId, setActiveServerId] = useState<string>("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setActiveStream(null);
    setServerError(null);
    setActiveServerId("");

    fetchEpisode(slug)
      .then((data) => {
        setEpisode(data);
        if (!data.servers.length) return;
        const pref = getServerPref();
        if (!pref.autoPlay) return;
        const groups = groupByQuality(data.servers);
        const best = findBestServer(groups, pref);
        if (best) autoLoadServer(best);
      })
      .catch(() => setServerError("Gagal memuat episode. Pastikan link episode valid."))
      .finally(() => setLoading(false));
  }, [slug]);

  const autoLoadServer = async (server: EpisodeServer) => {
    setActiveServerId(server.serverId);
    setServerLoading(true);
    try {
      const { url } = await fetchServer(server.serverId);
      if (url) setActiveStream({ url, key: server.serverId });
    } catch { /* ignore */ }
    finally { setServerLoading(false); }
  };

  const handleServerClick = async (server: EpisodeServer) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setActiveServerId(server.serverId);
    setServerLoading(true);
    setServerError(null);
    try {
      const { url } = await fetchServer(server.serverId);
      if (url) {
        setActiveStream({ url, key: server.serverId });
      } else {
        setServerError("URL tidak tersedia. Coba server lain.");
      }
    } catch {
      setServerError("Gagal memuat server. Coba server lain.");
    } finally {
      setServerLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(222,47%,5%)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Memuat episode...</p>
        </div>
      </div>
    );
  }

  const grouped = episode ? groupByQuality(episode.servers) : [];

  return (
    <div className="min-h-screen bg-[hsl(222,47%,5%)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Beranda
          </Link>
          {episode && (
            <>
              <span className="text-gray-600">/</span>
              <span className="text-gray-300 text-sm line-clamp-1">{episode.title}</span>
            </>
          )}
        </div>

        <AdBanner position="top" />

        <div>
          {serverLoading ? (
            <div className="w-full aspect-video bg-[hsl(222,47%,8%)] rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Memuat stream...</p>
              </div>
            </div>
          ) : serverError && !activeStream ? (
            <div className="w-full aspect-video bg-[hsl(222,47%,8%)] rounded-xl flex items-center justify-center">
              <div className="text-center px-4">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <p className="text-gray-300 text-sm mb-4">{serverError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm mx-auto transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Coba Lagi
                </button>
              </div>
            </div>
          ) : (
            <VideoPlayer stream={activeStream} />
          )}
        </div>

        {episode && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl font-bold text-white leading-snug">{episode.title}</h1>
              {episode.releaseTime && (
                <span className="text-xs text-gray-500 shrink-0 mt-1">{episode.releaseTime}</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {episode.prevEpisode?.episodeId && (
                <Link
                  href={`/tonton/${episode.prevEpisode.episodeId}`}
                  className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors px-3 py-2 rounded-lg bg-[hsl(222,47%,12%)] hover:bg-purple-900/20"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Sebelumnya
                </Link>
              )}
              {episode.nextEpisode?.episodeId && (
                <Link
                  href={`/tonton/${episode.nextEpisode.episodeId}`}
                  className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors px-3 py-2 rounded-lg bg-[hsl(222,47%,12%)] hover:bg-purple-900/20"
                >
                  Selanjutnya
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
              {episode.animeId && (
                <Link
                  href={`/anime/${episode.animeId}`}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg bg-[hsl(222,47%,12%)] hover:bg-white/5"
                >
                  Semua Episode
                </Link>
              )}
            </div>

            <div className="bg-[hsl(222,47%,8%)] rounded-2xl p-5 border border-purple-900/20">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-semibold text-white">Pilih Server</h2>
                {serverError && (
                  <span className="text-xs text-red-400 flex items-center gap-1 ml-auto">
                    <AlertCircle className="w-3 h-3" /> {serverError}
                  </span>
                )}
              </div>

              {grouped.length > 0 ? (
                <div className="space-y-4">
                  {grouped.map((group) => (
                    <div key={group.quality}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${QUALITY_COLORS[group.quality] || "bg-gray-800 text-gray-400 border-gray-700"}`}>
                          {group.quality}
                        </span>
                        <div className="flex-1 h-px bg-purple-900/20" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.servers.map((server, i) => {
                          const Icon = SERVER_ICONS[i % SERVER_ICONS.length];
                          const isActive = activeServerId === server.serverId;
                          const canEmbed = isEmbeddableServer(server.name);
                          return (
                            <button
                              key={server.serverId}
                              onClick={() => handleServerClick(server)}
                              disabled={serverLoading}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                                isActive
                                  ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30"
                                  : "bg-[hsl(222,47%,12%)] text-gray-400 border-purple-900/20 hover:bg-purple-900/30 hover:text-white hover:border-purple-600/40"
                              } disabled:opacity-60 disabled:cursor-not-allowed`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              {server.name}
                              {canEmbed && (
                                <span className="text-[10px] text-green-400 font-normal">embed</span>
                              )}
                              {serverLoading && isActive && <Loader2 className="w-3 h-3 animate-spin" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Tidak ada server tersedia untuk episode ini.</p>
              )}
            </div>
          </div>
        )}

        <AdBanner position="bottom" />
      </div>
    </div>
  );
}
