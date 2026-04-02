import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Shield, Plus, Trash2, ArrowLeft, Image, Link2, Layout,
  LogOut, Check, Eye, EyeOff, Settings, Tv, Star, ToggleLeft, ToggleRight
} from "lucide-react";
import { getAds, saveAd, deleteAd, toggleAd, type Ad } from "@/lib/store";

const ADMIN_PASS = "cipung";
const PASS_KEY = "anistream_admin_auth";
export const SERVER_PREF_KEY = "anistream_server_pref";

export interface ServerPref {
  defaultQuality: string;
  preferredServer: string;
  autoPlay: boolean;
}

const DEFAULT_PREF: ServerPref = {
  defaultQuality: "720p",
  preferredServer: "ondesuhd",
  autoPlay: true,
};

export function getServerPref(): ServerPref {
  try {
    const raw = localStorage.getItem(SERVER_PREF_KEY);
    return raw ? { ...DEFAULT_PREF, ...JSON.parse(raw) } : DEFAULT_PREF;
  } catch {
    return DEFAULT_PREF;
  }
}

function dispatchAdsUpdate() {
  window.dispatchEvent(new Event("ads-updated"));
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

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
          <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-600/30 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-900/30">
            <Shield className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Masukkan sandi untuk lanjut</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sandi admin"
              className="w-full bg-[hsl(222,47%,12%)] border border-purple-900/30 text-white placeholder-gray-500 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-purple-600/30"
          >
            Masuk
          </button>
        </form>
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

const AD_POSITIONS = [
  { value: "top", label: "Atas Halaman" },
  { value: "bottom", label: "Bawah Halaman" },
  { value: "sidebar", label: "Sidebar" },
  { value: "floating", label: "Floating" },
] as const;

const AD_TYPES = [
  { value: "image", label: "Gambar (URL)", icon: Image },
  { value: "script", label: "Skrip HTML", icon: Layout },
  { value: "iframe", label: "iFrame (URL)", icon: Link2 },
] as const;

const QUALITY_OPTIONS = ["360p", "480p", "720p", "1080p"];
const SERVER_OPTIONS = [
  { value: "ondesu", label: "Ondesu" },
  { value: "ondesuhd", label: "Ondesu HD" },
  { value: "vidhide", label: "Vidhide" },
  { value: "filedon", label: "Filedon" },
  { value: "mega", label: "Mega" },
];

function ServerSettings() {
  const [pref, setPref] = useState<ServerPref>(getServerPref());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem(SERVER_PREF_KEY, JSON.stringify(pref));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-[hsl(222,47%,8%)] border border-purple-900/20 rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Tv className="w-5 h-5 text-purple-400" />
        <h3 className="font-semibold text-white">Pengaturan Server Streaming</h3>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wider mb-3 block">Kualitas Default</label>
          <div className="flex flex-wrap gap-2">
            {QUALITY_OPTIONS.map((q) => (
              <button
                key={q}
                onClick={() => setPref({ ...pref, defaultQuality: q })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pref.defaultQuality === q
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "bg-[hsl(222,47%,12%)] text-gray-400 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2">Kualitas yang akan dipilih otomatis saat membuka episode</p>
        </div>

        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wider mb-3 block">Server Pilihan</label>
          <div className="flex flex-wrap gap-2">
            {SERVER_OPTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => setPref({ ...pref, preferredServer: s.value })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pref.preferredServer === s.value
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "bg-[hsl(222,47%,12%)] text-gray-400 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2">Server yang akan otomatis dipilih jika tersedia</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-[hsl(222,47%,12%)] rounded-xl">
          <div>
            <p className="text-sm font-medium text-white">Auto-play Episode</p>
            <p className="text-xs text-gray-500 mt-0.5">Mulai streaming otomatis saat halaman dibuka</p>
          </div>
          <button
            onClick={() => setPref({ ...pref, autoPlay: !pref.autoPlay })}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            {pref.autoPlay
              ? <ToggleRight className="w-8 h-8" />
              : <ToggleLeft className="w-8 h-8 text-gray-600" />}
          </button>
        </div>

        <div className="pt-1">
          {saved && (
            <div className="flex items-center gap-2 text-green-400 text-sm mb-3">
              <Check className="w-4 h-4" />
              Pengaturan server berhasil disimpan!
            </div>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-purple-600/20"
          >
            <Check className="w-4 h-4" />
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [activeTab, setActiveTab] = useState<"ads" | "server">("ads");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    label: "",
    position: "top" as Ad["position"],
    type: "image" as Ad["type"],
    content: "",
  });
  const [saved, setSaved] = useState(false);

  const reload = () => setAds(getAds());
  useEffect(() => { reload(); }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label || !form.content) return;
    saveAd({ ...form, active: true });
    dispatchAdsUpdate();
    setForm({ label: "", position: "top", type: "image", content: "" });
    setShowForm(false);
    setSaved(true);
    reload();
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id: string) => { deleteAd(id); dispatchAdsUpdate(); reload(); };
  const handleToggle = (id: string) => { toggleAd(id); dispatchAdsUpdate(); reload(); };

  const TABS = [
    { key: "ads", label: "Manajemen Iklan", icon: Star },
    { key: "server", label: "Pengaturan Server", icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-[hsl(222,47%,5%)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Beranda
            </Link>
            <span className="text-gray-600">/</span>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>

        <div className="flex gap-2 mb-6 bg-[hsl(222,47%,8%)] p-1 rounded-xl border border-purple-900/20">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "server" && <ServerSettings />}

        {activeTab === "ads" && (
          <>
            {saved && (
              <div className="mb-4 flex items-center gap-2 bg-green-900/30 border border-green-700/40 text-green-400 px-4 py-3 rounded-xl text-sm">
                <Check className="w-4 h-4" />
                Iklan berhasil disimpan!
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Daftar Iklan ({ads.length})
              </h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Iklan
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSave} className="bg-[hsl(222,47%,8%)] border border-purple-900/20 rounded-2xl p-6 mb-6 space-y-4">
                <h3 className="font-semibold text-white mb-4">Iklan Baru</h3>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Label / Nama Iklan</label>
                  <input
                    type="text"
                    value={form.label}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                    placeholder="Contoh: Google Ads Header"
                    className="w-full bg-[hsl(222,47%,12%)] border border-purple-900/30 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Posisi</label>
                    <select
                      value={form.position}
                      onChange={(e) => setForm({ ...form, position: e.target.value as Ad["position"] })}
                      className="w-full bg-[hsl(222,47%,12%)] border border-purple-900/30 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      {AD_POSITIONS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Tipe</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as Ad["type"] })}
                      className="w-full bg-[hsl(222,47%,12%)] border border-purple-900/30 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      {AD_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    {form.type === "script" ? "Kode HTML/Script" : "URL"}
                  </label>
                  {form.type === "script" ? (
                    <textarea
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      placeholder="<script>...</script> atau <div>...</div>"
                      rows={4}
                      className="w-full bg-[hsl(222,47%,12%)] border border-purple-900/30 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors font-mono resize-none"
                      required
                    />
                  ) : (
                    <input
                      type="url"
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-[hsl(222,47%,12%)] border border-purple-900/30 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                      required
                    />
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
                    <Check className="w-4 h-4" />
                    Simpan Iklan
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5">
                    Batal
                  </button>
                </div>
              </form>
            )}

            {ads.length === 0 ? (
              <div className="text-center py-16 bg-[hsl(222,47%,8%)] rounded-2xl border border-purple-900/20">
                <Plus className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Belum ada iklan. Klik "Tambah Iklan" untuk mulai.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ads.map((ad) => (
                  <div key={ad.id} className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${ad.active ? "bg-[hsl(222,47%,8%)] border-purple-900/20" : "bg-[hsl(222,47%,6%)] border-gray-800/50 opacity-60"}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-white">{ad.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${ad.active ? "bg-green-900/40 text-green-400" : "bg-gray-800 text-gray-500"}`}>
                          {ad.active ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="capitalize">{ad.position}</span>
                        <span>·</span>
                        <span className="capitalize">{ad.type}</span>
                        <span>·</span>
                        <span className="truncate max-w-[200px]">{ad.content}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggle(ad.id)}
                        className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        title={ad.active ? "Nonaktifkan" : "Aktifkan"}
                      >
                        {ad.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-900/20"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(
    sessionStorage.getItem(PASS_KEY) === "1"
  );

  const handleLogout = () => {
    sessionStorage.removeItem(PASS_KEY);
    setAuthed(false);
  };

  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />;
  return <AdminPanel onLogout={handleLogout} />;
}
