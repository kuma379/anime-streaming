import { Navbar } from "./navbar";
import { ReactNode } from "react";
import { AdDisplay } from "@/components/ads/ad-display";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <AdDisplay position="top" />
      <Navbar />
      <main className="flex-1">{children}</main>
      <AdDisplay position="bottom" />
      <footer className="py-6 border-t border-border/40 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="font-display font-bold text-base mb-1 text-foreground">AnimeStreaming</p>
          <p>Powered by AnimeStreaming</p>
        </div>
      </footer>
    </div>
  );
}
