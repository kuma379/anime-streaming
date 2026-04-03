import { useState, useEffect } from "react";
import { Lock, Plus, Trash2, Eye, EyeOff, MessageCircle, Image, Code2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ADMIN_PASSWORD = "cipung";
const WA_NUMBER = "087711086764";
const STORAGE_KEY = "anistream_ads";

interface Ad {
  id: string;
  name: string;
  position: "top" | "bottom" | "sidebar";
  type: "script" | "image";
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  active: boolean;
  createdAt: string;
}

function loadAds(): Ad[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : [];
  } catch { return []; }
}

function saveAds(ads: Ad[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ads, setAds] = useState<Ad[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Ad>>({ type: "image", position: "top", active: true });
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    if (authed) setAds(loadAds());
  }, [authed]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
    } else {
      setError("Password salah. Coba lagi.");
    }
  };

  const handleSave = () => {
    if (!form.name || !form.position || !form.type) return;
    if (form.type === "image" && !form.imageUrl) return;
    if (form.type === "script" && !form.content) return;

    const newAd: Ad = {
      id: Date.now().toString(),
      name: form.name!,
      position: form.position as Ad["position"],
      type: form.type as Ad["type"],
      content: form.content || "",
      imageUrl: form.imageUrl,
      linkUrl: form.linkUrl,
      active: form.active ?? true,
      createdAt: new Date().toISOString(),
    };

    const updated = [...ads, newAd];
    setAds(updated);
    saveAds(updated);
    setForm({ type: "image", position: "top", active: true });
    setShowForm(false);
  };

  const toggleAd = (id: string) => {
    const updated = ads.map((a) => (a.id === id ? { ...a, active: !a.active } : a));
    setAds(updated);
    saveAds(updated);
  };

  const deleteAd = (id: string) => {
    const updated = ads.filter((a) => a.id !== id);
    setAds(updated);
    saveAds(updated);
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-black">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">AnimeStreaming — Manajemen Iklan</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Masukkan password admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted/40 border-border/50"
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
            <Button type="submit" className="w-full rounded-full font-bold">Masuk</Button>
          </form>
          <div className="text-center pt-4 border-t border-border/40">
            <p className="text-xs text-muted-foreground mb-2">Ingin pasang iklan? Hubungi kami:</p>
            <a
              href={`https://wa.me/62${WA_NUMBER.replace(/^0/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600/10 border border-green-600/20 text-green-500 text-sm font-medium hover:bg-green-600/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp: {WA_NUMBER}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-black">Manajemen Iklan</h1>
          <p className="text-sm text-muted-foreground">AnimeStreaming Admin Panel</p>
        </div>
        <div className="flex gap-2">
          <a
            href={`https://wa.me/62${WA_NUMBER.replace(/^0/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600/10 border border-green-600/20 text-green-500 text-sm font-medium hover:bg-green-600/20 transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Pasang Iklan — WA {WA_NUMBER}
          </a>
          <Button onClick={() => setShowForm(true)} className="rounded-full gap-2 font-bold">
            <Plus className="w-4 h-4" /> Tambah Iklan
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-border/50 bg-card/60 p-6 space-y-4 shadow-xl">
          <h2 className="font-display font-bold text-lg">Tambah Iklan Baru</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nama Iklan</label>
              <Input
                placeholder="Nama iklan..."
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-muted/40 border-border/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Posisi</label>
              <select
                value={form.position || "top"}
                onChange={(e) => setForm({ ...form, position: e.target.value as Ad["position"] })}
                className="w-full h-10 px-3 rounded-md bg-muted/40 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="top">Atas (Top)</option>
                <option value="bottom">Bawah (Bottom)</option>
                <option value="sidebar">Samping (Sidebar)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Tipe Iklan</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setForm({ ...form, type: "image" })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    form.type === "image" ? "bg-primary text-primary-foreground border-primary" : "border-border/50 hover:bg-muted"
                  }`}
                >
                  <Image className="w-4 h-4" /> Gambar
                </button>
                <button
                  onClick={() => setForm({ ...form, type: "script" })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    form.type === "script" ? "bg-primary text-primary-foreground border-primary" : "border-border/50 hover:bg-muted"
                  }`}
                >
                  <Code2 className="w-4 h-4" /> Script
                </button>
              </div>
            </div>
          </div>

          {form.type === "image" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">URL Gambar</label>
                <Input
                  placeholder="https://..."
                  value={form.imageUrl || ""}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="bg-muted/40 border-border/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Link Tujuan (opsional)</label>
                <Input
                  placeholder="https://..."
                  value={form.linkUrl || ""}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  className="bg-muted/40 border-border/50"
                />
              </div>
            </div>
          )}

          {form.type === "script" && (
            <div className="space-y-1">
              <label className="text-sm font-medium">Kode Iklan (HTML/Script)</label>
              <textarea
                placeholder="<script>...</script> atau <div>...</div>"
                value={form.content || ""}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={5}
                className="w-full px-3 py-2 rounded-md bg-muted/40 border border-border/50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} className="rounded-full font-bold gap-2">
              <Plus className="w-4 h-4" /> Simpan Iklan
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-full">
              Batal
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {ads.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground space-y-2">
            <p className="text-4xl opacity-20">📢</p>
            <p className="font-medium">Belum ada iklan</p>
            <p className="text-sm">Klik "Tambah Iklan" untuk mulai mengelola iklan.</p>
          </div>
        ) : (
          ads.map((ad) => (
            <div
              key={ad.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                ad.active ? "border-border/50 bg-card/40" : "border-border/20 bg-muted/10 opacity-60"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                {ad.type === "image" ? <Image className="w-5 h-5 text-muted-foreground" /> : <Code2 className="w-5 h-5 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{ad.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{ad.position}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{ad.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ad.active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"}`}>
                    {ad.active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleAd(ad.id)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  title={ad.active ? "Nonaktifkan" : "Aktifkan"}
                >
                  {ad.active ? <ToggleRight className="w-5 h-5 text-primary" /> : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                </button>
                <button
                  onClick={() => deleteAd(ad.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="rounded-2xl border border-border/40 bg-muted/20 p-6 text-center space-y-3">
        <h2 className="font-display font-bold text-lg">Ingin Pasang Iklan?</h2>
        <p className="text-sm text-muted-foreground">Hubungi kami via WhatsApp untuk info harga dan pemasangan iklan di AnimeStreaming.</p>
        <a
          href={`https://wa.me/62${WA_NUMBER.replace(/^0/, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-900/30"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp: {WA_NUMBER}
        </a>
      </div>
    </div>
  );
}
