import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "wouter";
import axios from "axios";
import {
  Play, ArrowLeft, ChevronRight, Monitor,
  AlertCircle, RefreshCw, Wifi, Zap, Signal
} from "lucide-react";
import { fetchEpisode, type EpisodeDetail, type EpisodeServer } from "@/lib/api";
import { AdBanner } from "@/components/AdBanner";

const SAMPLE_SERVERS: EpisodeServer[] = [
  { name: "Nonton HD", serverId: "winbu?post=66146&nume=1&type=schtml" },
  { name: "Nonton SD", serverId: "winbu?post=66146&nume=2&type=schtml" },
  { name: "Backup 1", serverId: "6DC77B-6-8B5u" },
  { name: "Backup 2", serverId: "sd-p2" },
];

interface StreamData {
  url: string;
  isEmbed: boolean;
  isDirect: boolean;
}

function VideoPlayer({ serverId }: { serverId: string }) {
  const [stream, setStream] = useState<StreamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const fetchStream = async () => {
    setLoading(true);
    setError(null);
    setStream(null);

    try {
      const apiUrl = serverId.startsWith("winbu?")
        ? `/api/anime/winbu/server?${serverId.replace("winbu?", "")}`
        : `/api/anime/server/${encodeURIComponent(serverId)}`;

      const { data } = await axios.get<{ url: string; type: string }>(apiUrl, {
        timeout: 20000,
      });

      if (!data?.url) throw new Error("URL tidak ditemukan");

      const isDirect = /\.(mp4|mkv|webm|m3u8)(\?|$)/i.test(data.url);
      const isEmbed = !isDirect;

      setStream({ url: data.url, isEmbed, isDirect });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.code === "ECONNABORTED") {
          setError("Koneksi timeout. Coba server lain.");
        } else {
          setError(err.response?.data?.error || "Server tidak merespons");
        }
      } else {
        setError("Gagal memuat stream. Coba server lain.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStream();
  }, [serverId]);

  if (loading) {
    return (
      <div className="w-full aspect-video bg-[hsl(222,47%,8%)] rounded-xl flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 border-[3px] border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Menghubungkan ke server...</p>
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full aspect-video bg-[hsl(222,47%,8%)] rounded-xl flex items-center justify-center">
        <div className="text-center px-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-900/30 border border-red-700/50 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <p className="text-gray-300 font-semibold mb-1">Server Tidak Tersedia</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
          <button
            onClick={fetchStream}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors mx-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!stream) return null;

  if (stream.isDirect) {
    return (
      <div className="w-full rounded-xl overflow-hidden bg-black shadow-2xl shadow-purple-900/30">
        <video
          key={stream.url}
          controls
          autoPlay
          playsInline
          className="w-full aspect-video"
          src={stream.url}
          style={{ maxHeight: "75vh" }}
        >
          Browser tidak mendukung video HTML5.
        </video>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl overflow-hidden bg-black shadow-2xl shadow-purple-900/30">
      <iframe
        ref={iframeRef}
        key={stream.url}
        src={stream.url}
        className="w-full aspect-video"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        title="Anime Stream Player"
        scrolling="no"
        style={{ border: "none", display: "block" }}
      />
    </div>
  );
}

export default function Watch() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "sd-p2-episode-10-sub-indo";
  const [episode, setEpisode] = useState<EpisodeDetail | null>(null);
  const [servers, setServers] = useState<EpisodeServer[]>(SAMPLE_SERVERS);
  const [activeServer, setActiveServer] = useState<EpisodeServer>(SAMPLE_SERVERS[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchEpisode(slug)
      .then((data) => {
        setEpisode(data);
        if (data.servers?.length) {
          setServers(data.servers);
          setActiveServer(data.servers[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const title = episode?.title || slug.replace(/-/g, " ").replace(/\bsub indo\b/i, "Sub Indo");

  const serverIcons = [Zap, Signal, Wifi, Play];

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
              <div className="w-full aspect-video bg-[hsl(222,47%,8%)] rounded-xl animate-pulse" />
            ) : (
              <VideoPlayer serverId={activeServer.serverId} />
            )}

            <div className="bg-[hsl(222,47%,8%)] rounded-xl p-5 border border-purple-900/20">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-semibold text-white">Pilih Server Streaming</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {servers.map((server, idx) => {
                  const Icon = serverIcons[idx % serverIcons.length];
                  const isActive = activeServer.serverId === server.serverId;
                  return (
                    <button
                      key={server.serverId}
                      onClick={() => setActiveServer(server)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                        isActive
                          ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/40"
                          : "bg-[hsl(222,47%,12%)] border-purple-900/20 text-gray-300 hover:bg-[hsl(222,47%,18%)] hover:text-white hover:border-purple-700/40"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-yellow-300" : "text-gray-500"}`} />
                      {server.name}
                      {idx === 0 && (
                        <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full font-semibold">
                          CEPAT
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Jika server tidak berjalan, coba pilih server lain
              </p>
            </div>

            <div className="bg-[hsl(222,47%,8%)] rounded-xl p-5 border border-purple-900/20">
              <h1 className="text-xl font-bold text-white mb-1">{episode?.title || title}</h1>
              {episode?.anime && (
                <p className="text-purple-400 text-sm mb-2">{episode.anime}</p>
              )}
              {episode?.synopsis && (
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{episode.synopsis}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <AdBanner position="sidebar" />

            <div className="bg-[hsl(222,47%,8%)] rounded-xl p-5 border border-purple-900/20">
              <h2 className="text-sm font-semibold text-white mb-4">Episode Lainnya</h2>
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => {
                  const ep = 10 - i;
                  if (ep <= 0) return null;
                  const isActive = slug.includes(`episode-${ep}`);
                  return (
                    <Link
                      key={ep}
                      href={`/tonton/${slug.replace(/episode-\d+/, `episode-${ep}`)}`}
                      className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors group ${
                        isActive
                          ? "bg-purple-600/20 border border-purple-600/40"
                          : "hover:bg-[hsl(222,47%,12%)]"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isActive ? "bg-purple-600" : "bg-[hsl(222,47%,12%)] group-hover:bg-purple-900/40"
                      }`}>
                        <span className={`text-xs font-bold ${isActive ? "text-white" : "text-gray-400 group-hover:text-purple-300"}`}>
                          {ep}
                        </span>
                      </div>
                      <span className={`text-sm transition-colors ${
                        isActive ? "text-purple-300 font-medium" : "text-gray-300 group-hover:text-white"
                      }`}>
                        Episode {ep}
                      </span>
                      {isActive && (
                        <span className="ml-auto text-[10px] text-purple-400 font-medium">Aktif</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <AdBanner position="bottom" className="mt-8" />
      </div>
    </div>
  );
}
