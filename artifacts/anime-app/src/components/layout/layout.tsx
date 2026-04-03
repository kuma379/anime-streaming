import { Navbar } from "./navbar";
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="py-8 border-t border-border mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="font-display font-bold text-lg mb-2 text-foreground">AniStream</p>
          <p>Powered by Samehadaku Data. Built for anime fans.</p>
        </div>
      </footer>
    </div>
  );
}
