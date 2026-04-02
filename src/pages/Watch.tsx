import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "wouter";
import {
  Play, ArrowLeft, ChevronRight, ChevronLeft, Monitor,
  AlertCircle, RefreshCw, Zap, Signal, Wifi, Loader2
} from "lucide-react";
import { fetchEpisode, fetchServer, type EpisodeDetail, type EpisodeServer } from "@/lib/api";
import { AdBanner } from "@/components/AdBanner";

interface ActiveStream {
  url: string;
  key: string;
}

function VideoPlayer({ streamUrl }: { streamUrl: string }) {
  if (!streamUrl) {
    return (
      <div className="w-full aspect-video bg-[hsl(222,47%,8%)] rounded-xl flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">URL stream tidak tersedia</p>
        </div>
      </div>
    );
  }

  const isDirect = /\.(mp4|mkv|webm|m3u8)(\?|$)/i.test(streamUrl);

  if (isDirect) {
    return (
      <div className="w-full rounded-xl overflow-hidden bg-black shadow-2xl shadow-purple-900/30">
        <video
          key={streamUrl}
          controls
          autoPlay
          playsInline
          className="w-full aspect-video"
          src={streamUrl}
        >
          Browser tidak mendukung video HTML5.
        </video>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl overflow-hidden bg-black shadow-2xl shadow-purple-900/30">
      <iframe
        key={streamUrl}
        src={streamUrl}
        className="w-full aspect-video"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        title="Stream Player"
        scrolling="no"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ border: "none", display: "block" }}
      />
    </div>
  );
}

const SERVER_ICONS = [Zap, Signal, Wifi, Play, Monitor];
const QUALITY_COLORS: Record<string, string> = {
  "720p": "text-blue-400",
  "480p": "text-green-400",
  "360p": "text-yellow-400",
  "1080p": "text-purple-400",
};

export default function Watch() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "sd-p2-episode-10-sub-indo";

  const [episode, setEpisode] = useState<EpisodeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStream, setActiveStream] = useState<ActiveStream | null>(null);
  const [serverLoading, setServerLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [activeServerId, setActiveServerId] = useState<string>("default");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setLoading(true);
    setActiveStream(null);
    setServerError(null);
    setActiveServerId("default");

    fetchEpisode(slug)
      .then((data) => {
        setEpisode(data);
        if (data.defaultStreamingUrl) {
          setActiveStream({ url: data.defaultStreamingUrl, key: "default" });
        }
      })
      .catch(() => setServerError("Gagal memuat episode. Coba refresh."))
      .finally(() => setLoading(false));
  }, [slug]);

  const switchServer = async (server: EpisodeServer) => {
    if (serverLoading) return;
    if (abortRef.current) abortRef.current.abort();

    setActiveServerId(server.serverId);
    setServerLoading(true);
    setServerError(null);

    try {
      const result = await fetchServer(server.serverId);
      if (result?.url) {
        setActiveStream({ url: result.url, key: server.serverId });
      } else {
        setServerError("Server tidak mengembalikan URL. Coba server lain.");
      }
    } catch {
      setServerError("Server tidak merespons. Coba pilih server lain.");
    } finally {
      setServerLoading(false);
    }
  };

  const useDefault = () => {
    if (!episode?.defaultStreamingUrl) return;
    setActiveServerId("default");
    setActiveStream({ url: episode.defaultStreamingUrl, key: "default" });
    setServerError(null);
  };

  const title = episode?.title || slug.replace(/-/g, " ").replace(/\bsub indo\b/i, "Sub Indo");
  const prevSlug = episode?.prevEpisode?.episodeId;
  const nextSlug = episode?.nextEpisode?.episodeId;

  const groupedServers: Record<string, EpisodeServer[]> = {};
  for (const s of episode?.servers || []) {
    const q = s.quality || "Lainnya";
    if (!groupedServers[q]) groupedServers[q] = [];
    groupedServers[q].push(s);
  }

  return (
    <div className="min-h-screen bg-[hsl(222,47%,5%)] pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-5 text-sm text-gray-400">
          <Link href="/" className="flex items-center gap-1 hover:text-purple-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Beranda
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white truncate max-w-xs">{title}</span>
        </div>

        <AdBanner position="top" className="mb-5" />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="w-full aspect-video bg-[hsl(222,47%,8%)] rounded-xl flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-14 h-14 border-[3px] border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-gray-400 text-sm">Memuat episode...</p>
                </div>
              </div>
            ) : serverError && !activeStream ? (
              <div className="w-full aspect-video bg-[hsl(222,47%,8%)] rounded-xl flex items-center justify-center">
                <div className="text-center px-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-900/30 border border-red-700/50 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-gray-300 font-semibold">{serverError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors mx-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                  </button>
                </div>
              </div>
            ) : activeStream ? (
              <div className="relative">
                {serverLoading && (
                  <div className="absolute inset-0 bg-black/70 z-10 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-2" />
                      <p className="text-gray-300 text-sm">Beralih server...</p>
                    </div>
                  </div>
                )}
                <VideoPlayer streamUrl={activeStream.url} />
              </div>
            ) : null}

            {serverError && activeStream && (
              <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg px-4 py-2.5 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <p className="text-yellow-300 text-sm">{serverError}</p>
              </div>
            )}

            <div className="bg-[hsl(222,47%,8%)] rounded-xl p-5 border border-purple-900/20">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-semibold text-white">Pilih Server Streaming</h2>
              </div>

              <div className="mb-3">
                <p className="text-[11px] text-gray-500 uppercase font-semibold mb-2 tracking-wider">Default</p>
                <button
                  onClick={useDefault}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                    activeServerId === "default"
                      ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/40"
                      : "bg-[hsl(222,47%,12%)] border-purple-900/20 text-gray-300 hover:bg-[hsl(222,47%,18%)] hover:text-white"
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 ${activeServerId === "default" ? "text-yellow-300" : "text-gray-500"}`} />
                  Server Utama
                  <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full font-semibold">
                    CEPAT
                  </span>
                </button>
              </div>

              {Object.entries(groupedServers).map(([quality, servers]) => (
                <div key={quality} className="mb-3">
                  <p className="text-[11px] text-gray-500 uppercase font-semibold mb-2 tracking-wider flex items-center gap-1">
                    <span className={QUALITY_COLORS[quality] || "text-gray-400"}>{quality}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {servers.map((server, idx) => {
                      const Icon = SERVER_ICONS[idx % SERVER_ICONS.length];
                      const isActive = activeServerId === server.serverId;
                      return (
                        <button
                          key={server.serverId}
                          onClick={() => switchServer(server)}
                          disabled={serverLoading}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all border disabled:opacity-60 ${
                            isActive
                              ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/40"
                              : "bg-[hsl(222,47%,12%)] border-purple-900/20 text-gray-300 hover:bg-[hsl(222,47%,18%)] hover:text-white hover:border-purple-700/40"
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isActive ? "text-yellow-300" : "text-gray-500"}`} />
                          {server.name.split(" (")[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <p className="text-xs text-gray-500 mt-2">
                Jika video tidak muncul, coba pilih server lain di bawah
              </p>
            </div>

            <div className="bg-[hsl(222,47%,8%)] rounded-xl p-5 border border-purple-900/20">
              <h1 className="text-xl font-bold text-white mb-1">{title}</h1>
              {episode?.releaseTime && (
                <p className="text-gray-500 text-xs">{episode.releaseTime}</p>
              )}
            </div>

            <div className="flex gap-3">
              {prevSlug && (
                <Link
                  href={`/tonton/${prevSlug}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-[hsl(222,47%,10%)] hover:bg-[hsl(222,47%,15%)] border border-purple-900/30 text-gray-300 hover:text-white px-4 py-3 rounded-xl text-sm font-medium transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Episode Sebelumnya
                </Link>
              )}
              {nextSlug && (
                <Link
                  href={`/tonton/${nextSlug}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                >
                  Episode Berikutnya
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <AdBanner position="sidebar" />

            {(prevSlug || nextSlug) && (
              <div className="bg-[hsl(222,47%,8%)] rounded-xl p-5 border border-purple-900/20">
                <h2 className="text-sm font-semibold text-white mb-3">Navigasi Episode</h2>
                <div className="space-y-2">
                  {prevSlug && (
                    <Link
                      href={`/tonton/${prevSlug}`}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[hsl(222,47%,12%)] transition-colors group"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-purple-400" />
                      <span className="text-sm text-gray-300 group-hover:text-white">Episode Sebelumnya</span>
                    </Link>
                  )}
                  {nextSlug && (
                    <Link
                      href={`/tonton/${nextSlug}`}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[hsl(222,47%,12%)] transition-colors group"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400" />
                      <span className="text-sm text-gray-300 group-hover:text-white">Episode Berikutnya</span>
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="bg-[hsl(222,47%,8%)] rounded-xl p-5 border border-purple-900/20">
              <h2 className="text-sm font-semibold text-white mb-1">Tips Streaming</h2>
              <ul className="text-xs text-gray-500 space-y-1.5 mt-2">
                <li>• Gunakan <span className="text-purple-400">Server Utama</span> untuk kecepatan terbaik</li>
                <li>• Pilih kualitas <span className="text-blue-400">720p</span> untuk HD</li>
                <li>• Pilih kualitas <span className="text-green-400">480p</span> jika koneksi lambat</li>
                <li>• Aktifkan fullscreen untuk pengalaman terbaik</li>
              </ul>
            </div>
          </div>
        </div>

        <AdBanner position="bottom" className="mt-8" />
      </div>
    </div>
  );
}
