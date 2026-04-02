import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import axios from "axios";
import {
  Play, ArrowLeft, ChevronRight, ExternalLink, Monitor,
  AlertCircle, Download, Copy, Check, RefreshCw, Video
} from "lucide-react";
import { fetchEpisode, type EpisodeDetail, type EpisodeServer } from "@/lib/api";
import { AdBanner } from "@/components/AdBanner";

const SAMPLE_SERVERS: EpisodeServer[] = [
  { name: "Server 1 (Winbu)", serverId: "winbu?post=66146&nume=1&type=schtml" },
  { name: "Server 2 (HD)", serverId: "6DC77B-6-8B5u" },
  { name: "Server 3 (SD)", serverId: "sd-p2" },
];

interface StreamData {
  url: string;
  type: string;
  isVideo: boolean;
}

function VideoPlayer({ serverId }: { serverId: string }) {
  const [stream, setStream] = useState<StreamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchStream = async () => {
    setLoading(true);
    setError(null);
    setStream(null);

    try {
      const apiUrl = serverId.startsWith("winbu?")
        ? `/api/anime/winbu/server?${serverId.replace("winbu?", "")}`
        : `/api/anime/server/${encodeURIComponent(serverId)}`;

      const { data } = await axios.get<{ url: string; type: string }>(apiUrl, {
        timeout: 15000,
      });

      if (!data?.url) throw new Error("URL stream tidak ditemukan");

      const isVideo =
        /\.(mp4|mkv|webm|avi|mov|m3u8)/i.test(data.url) ||
        data.url.includes("stream") ||
        data.url.includes("video");

      setStream({ url: data.url, type: data.type || "embed", isVideo });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message || "Gagal menghubungi server");
      } else {
        setError("Server tidak merespons. Coba server lain.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStream();
  }, [serverId]);

  const handleCopy = () => {
    if (!stream?.url) return;
    navigator.clipboard.writeText(stream.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="w-full aspect-video bg-[hsl(222,47%,8%)] rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Mengambil stream dengan axios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full aspect-video bg-[hsl(222,47%,8%)] rounded-xl flex items-center justify-center">
        <div className="text-center px-6">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-300 font-medium mb-1">Server Tidak Tersedia</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={fetchStream}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stream) return null;

  if (stream.isVideo) {
    return (
      <div className="w-full rounded-xl overflow-hidden bg-black">
        <video
          key={stream.url}
          controls
          autoPlay
          className="w-full aspect-video"
          src={stream.url}
        >
          Browser Anda tidak mendukung tag video.
        </video>
        <div className="bg-[hsl(222,47%,8%)] px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-gray-400 truncate flex-1 mr-4 font-mono">
            {stream.url.length > 60 ? stream.url.slice(0, 60) + "..." : stream.url}
          </span>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Disalin!" : "Salin URL"}
            </button>
            <a
              href={stream.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl overflow-hidden bg-[hsl(222,47%,8%)] border border-purple-900/20">
      <div className="aspect-video flex flex-col items-center justify-center gap-5 px-6">
        <div className="w-20 h-20 rounded-full bg-purple-600/20 border-2 border-purple-500 flex items-center justify-center">
          <Video className="w-9 h-9 text-purple-400" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-lg mb-2">Stream Berhasil Diambil</p>
          <p className="text-gray-400 text-sm mb-1">URL Stream (via Axios):</p>
          <div className="bg-[hsl(222,47%,12%)] rounded-lg px-4 py-2 max-w-md mx-auto">
            <p className="text-purple-300 text-xs font-mono break-all text-center">
              {stream.url.length > 80 ? stream.url.slice(0, 80) + "..." : stream.url}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <a
            href={stream.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
          >
            <Play className="w-4 h-4 fill-white" />
            Tonton Video
          </a>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-[hsl(222,47%,16%)] hover:bg-[hsl(222,47%,20%)] text-gray-300 hover:text-white px-5 py-2.5 rounded-full text-sm transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Disalin!" : "Salin URL"}
          </button>
        </div>
      </div>
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

  const title = episode?.title || slug.replace(/-/g, " ").replace(/sub indo/i, "Sub Indo");

  return (
    <div className="min-h-screen bg-[hsl(222,47%,5%)] pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 text-sm text-gray-400">
          <Link href="/" className="flex items-center gap-1 hover:text-purple-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Beranda
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white truncate">{title}</span>
        </div>

        <AdBanner position="top" className="mb-4" />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="w-full aspect-video bg-[hsl(222,47%,8%)] rounded-xl animate-pulse" />
            ) : (
              <VideoPlayer serverId={activeServer.serverId} />
            )}

            <div className="bg-[hsl(222,47%,8%)] rounded-xl p-5 border border-purple-900/20">
              <h1 className="text-xl font-bold text-white mb-1">
                {episode?.title || title}
              </h1>
              {episode?.anime && (
                <p className="text-purple-400 text-sm mb-3">{episode.anime}</p>
              )}
              {episode?.synopsis && (
                <p className="text-gray-400 text-sm leading-relaxed">{episode.synopsis}</p>
              )}
            </div>

            <div className="bg-[hsl(222,47%,8%)] rounded-xl p-5 border border-purple-900/20">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-semibold text-white">Pilih Server</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {servers.map((server) => (
                  <button
                    key={server.serverId}
                    onClick={() => setActiveServer(server)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeServer.serverId === server.serverId
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                        : "bg-[hsl(222,47%,12%)] text-gray-300 hover:bg-[hsl(222,47%,18%)] hover:text-white"
                    }`}
                  >
                    <Play className="w-3 h-3" />
                    {server.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <AdBanner position="sidebar" />

            <div className="bg-[hsl(222,47%,8%)] rounded-xl p-5 border border-purple-900/20">
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-purple-400" />
                Link Langsung
              </h2>
              <div className="space-y-2">
                <a
                  href="https://www.sankavollerei.com/anime/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Buka di sumber
                </a>
                <a
                  href={`https://www.sankavollerei.com/anime/episode/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Episode asli
                </a>
              </div>
            </div>

            <div className="bg-[hsl(222,47%,8%)] rounded-xl p-5 border border-purple-900/20">
              <h2 className="text-sm font-semibold text-white mb-4">Episode Lainnya</h2>
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => {
                  const ep = 10 - i;
                  return ep > 0 ? (
                    <Link
                      key={ep}
                      href={`/tonton/${slug.replace(/episode-\d+/, `episode-${ep}`)}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[hsl(222,47%,12%)] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[hsl(222,47%,12%)] flex items-center justify-center flex-shrink-0 group-hover:bg-purple-900/40">
                        <span className="text-xs font-medium text-gray-400 group-hover:text-purple-300">
                          {ep}
                        </span>
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                        Episode {ep}
                      </span>
                    </Link>
                  ) : null;
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
