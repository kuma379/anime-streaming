import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Play, Shield } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Beranda" },
    { href: "/jadwal", label: "Jadwal" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[hsl(222,47%,5%)]/90 backdrop-blur-md border-b border-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:bg-purple-500 transition-colors">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Anime<span className="text-purple-400">Stream</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location === l.href
                    ? "text-white bg-purple-600/20 text-purple-300"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-purple-400 transition-colors px-3 py-1.5 rounded-lg border border-purple-900/40 hover:border-purple-600/60 hover:bg-purple-900/20"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-purple-900/20 bg-[hsl(222,47%,5%)]">
          <div className="px-4 py-3 space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location === l.href
                    ? "text-white bg-purple-600/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:text-purple-400 hover:bg-purple-900/20 border border-purple-900/30 transition-colors mt-2"
            >
              <Shield className="w-4 h-4" />
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
