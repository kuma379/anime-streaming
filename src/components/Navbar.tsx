import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Search, Menu, X, Play } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, navigate] = useLocation();

  const links = [
    { href: "/", label: "Beranda" },
    { href: "/jadwal", label: "Jadwal" },
    { href: "/cari?genre=shounen", label: "Genre" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/cari?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setIsOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href.split("?")[0]);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(222,47%,5%)/95] backdrop-blur-md border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-purple-400 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <Play className="w-4 h-4 fill-white text-white" />
            </div>
            <span className="text-white">Ani<span className="text-purple-400">Stream</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-purple-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2 bg-[hsl(222,47%,12%)] rounded-full px-4 py-2 w-48 lg:w-64">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Cari anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
              />
            </form>
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[hsl(222,47%,8%)] border-t border-purple-900/30 px-4 py-4 flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-[hsl(222,47%,12%)] rounded-full px-4 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
            />
          </form>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium ${
                isActive(link.href) ? "text-purple-400" : "text-gray-300"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
