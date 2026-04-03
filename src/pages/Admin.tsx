import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Shield, Plus, Trash2, ArrowLeft, Image, Link2, Layout, LogOut, Check, Code } from "lucide-react";
import { getAds, saveAd, deleteAd, type Ad } from "@/lib/store";

const ADMIN_PASS = "cipung";
const PASS_KEY = "anistream_admin_auth";

function dispatchAdsUpdate() {
  window.dispatchEvent(new Event("ads-updated"));
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      sessionStorage.setItem(PASS_KEY, "1");
      onLogin();
    } else {
      setError("Sandi salah. Coba lagi.");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(222,47%,5%)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-600/30 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Masukkan sandi untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[hsl(222,47%,8%)] rounded-2xl p-6 border border-purple-900/20 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sandi Admin</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Masukkan sandi..."
              className="w-full bg-[hsl(222,47%,12%)] border border-purple-900/30 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-purple-500 transition-colors"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            Masuk
          </button>
        </form>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 flex items-center gap-1 justify-center">
            <ArrowLeft className="w-3 h-3" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

function AddAdForm({ onAdded }: { onAdded: () => void }) {
  const [adType, setAdType] = useState<"image" | "script">("image");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("https://");
  const [scriptCode, setScriptCode] = useState("");
  const [position, setPosition] = useState<Ad["position"]>("top");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    if (adType === "image" && !linkUrl) return;
    if (adType === "script" && !scriptCode) return;

    saveAd({
      title,
      imageUrl: adType === "image" ? imageUrl : "",
      linkUrl: adType === "image" ? linkUrl : "#",
      scriptCode: adType === "script" ? scriptCode : undefined,
      type: adType,
      position,
    });
    dispatchAdsUpdate();
    setTitle("");
    setImageUrl("");
    setLinkUrl("https://");
    setScriptCode("");
    setPosition("top");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[hsl(222,47%,8%)] rounded-2xl p-6 border border-purple-900/20 space-y-4">
      <h2 className="text-base font-bold text-white flex items-center gap-2">
        <Plus className="w-4 h-4 text-purple-400" />
        Tambah Iklan Baru
      </h2>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setAdType("image")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${adType === "image" ? "bg-purple-600 text-white border-purple-500" : "bg-[hsl(222,47%,12%)] text-gray-400 border-purple-900/20 hover:text-white"}`}
        >
          <Image className="w-3.5 h-3.5" /> Iklan Gambar
        </button>
        <button
          type="button"
          onClick={() => setAdType("script")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${adType === "script" ? "bg-purple-600 text-white border-purple-500" : "bg-[hsl(222,47%,12%)] text-gray-400 border-purple-900/20 hover:text-white"}`}
        >
          <Code className="w-3.5 h-3.5" /> Iklan Script
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Judul Iklan <span className="text-red-400">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nama / judul iklan"
            required
            className="w-full bg-[hsl(222,47%,12%)] border border-purple-900/30 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Posisi</label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value as Ad["position"])}
            className="w-full bg-[hsl(222,47%,12%)] border border-purple-900/30 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500 transition-colors"
          >
            <option value="top">Atas (Header)</option>
            <option value="sidebar">Samping (Sidebar)</option>
            <option value="bottom">Bawah (Footer)</option>
          </select>
        </div>
      </div>

      {adType === "image" ? (
        <>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1">
              <Image className="w-3 h-3" /> URL Gambar Iklan
            </label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://contoh.com/gambar-iklan.jpg"
              className="w-full bg-[hsl(222,47%,12%)] border border-purple-900/30 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1">
              <Link2 className="w-3 h-3" /> URL Tujuan Iklan <span className="text-red-400">*</span>
            </label>
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://website-pengiklan.com"
              required={adType === "image"}
              type="url"
              className="w-full bg-[hsl(222,47%,12%)] border border-purple-900/30 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </>
      ) : (
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1">
            <Code className="w-3 h-3" /> Kode Script Iklan <span className="text-red-400">*</span>
          </label>
          <textarea
            value={scriptCode}
            onChange={(e) => setScriptCode(e.target.value)}
            placeholder={'<script src="https://..."></script>\natau kode banner iklan lainnya'}
            required={adType === "script"}
            rows={4}
            className="w-full bg-[hsl(222,47%,12%)] border border-purple-900/30 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500 transition-colors font-mono"
          />
          <p className="text-xs text-gray-500 mt-1">Tempel script tag dari jaringan iklan Anda di sini.</p>
        </div>
      )}

      <button
        type="submit"
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
      >
        {saved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {saved ? "Iklan Disimpan!" : "Tambah Iklan"}
      </button>
    </form>
  );
}

function AdList({ ads, onDelete }: { ads: Ad[]; onDelete: (id: string) => void }) {
  const positionLabel: Record<Ad["position"], string> = {
    top: "Atas",
    sidebar: "Samping",
    bottom: "Bawah",
  };

  if (ads.length === 0) {
    return (
      <div className="bg-[hsl(222,47%,8%)] rounded-2xl p-8 border border-purple-900/20 text-center">
        <Layout className="w-10 h-10 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Belum ada iklan. Tambahkan iklan pertama!</p>
      </div>
    );
  }

  return (
    <div className="bg-[hsl(222,47%,8%)] rounded-2xl border border-purple-900/20 overflow-hidden">
      <div className="px-6 py-4 border-b border-purple-900/20">
        <h2 className="text-base font-bold text-white">
          Daftar Iklan ({ads.length})
        </h2>
      </div>
      <div className="divide-y divide-purple-900/20">
        {ads.map((ad) => (
          <div key={ad.id} className="flex items-center gap-4 px-6 py-4">
            {ad.type === "script" ? (
              <div className="w-16 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <Code className="w-5 h-5 text-purple-400" />
              </div>
            ) : ad.imageUrl ? (
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="w-16 h-12 object-cover rounded-lg flex-shrink-0 bg-[hsl(222,47%,12%)]"
              />
            ) : (
              <div className="w-16 h-12 rounded-lg bg-[hsl(222,47%,12%)] flex items-center justify-center flex-shrink-0">
                <Image className="w-5 h-5 text-gray-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{ad.title}</p>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {ad.type === "script" ? "Script iklan" : ad.linkUrl}
              </p>
              <div className="flex gap-1.5 mt-1">
                <span className="inline-block text-xs bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded-full">
                  Posisi: {positionLabel[ad.position]}
                </span>
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${ad.type === "script" ? "bg-blue-900/40 text-blue-300" : "bg-green-900/40 text-green-300"}`}>
                  {ad.type === "script" ? "Script" : "Gambar"}
                </span>
              </div>
            </div>
            <button
              onClick={() => onDelete(ad.id)}
              className="flex items-center gap-1.5 bg-red-900/30 hover:bg-red-900/60 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(PASS_KEY) === "1"
  );
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    if (authenticated) {
      setAds(getAds());
    }
  }, [authenticated]);

  const refreshAds = () => {
    setAds(getAds());
  };

  const handleDelete = (id: string) => {
    deleteAd(id);
    dispatchAdsUpdate();
    refreshAds();
  };

  const handleLogout = () => {
    sessionStorage.removeItem(PASS_KEY);
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[hsl(222,47%,5%)] pt-6 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-600/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Panel Admin</h1>
              <p className="text-xs text-gray-400">Kelola iklan AniStream</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Beranda
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors bg-red-900/20 hover:bg-red-900/30 px-3 py-1.5 rounded-lg"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <AddAdForm onAdded={refreshAds} />
          <AdList ads={ads} onDelete={handleDelete} />
        </div>

        <p className="text-center text-xs text-gray-600 mt-8">
          Halaman ini tidak tersedia untuk publik. Iklan tersimpan di browser lokal.
        </p>
      </div>
    </div>
  );
}
