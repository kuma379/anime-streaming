import { Skeleton } from "@/components/ui/skeleton";

export function AnimeCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-2">
      <Skeleton className="aspect-[3/4] w-full rounded-lg" />
      <div className="flex flex-col gap-2 px-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[60vh] min-h-[500px] overflow-hidden bg-muted">
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-24 z-10 w-full md:w-2/3 lg:w-1/2 gap-4">
        <Skeleton className="h-6 w-24 bg-white/20" />
        <Skeleton className="h-12 w-full md:w-3/4 bg-white/20" />
        <Skeleton className="h-4 w-full bg-white/20" />
        <Skeleton className="h-4 w-5/6 bg-white/20" />
        <Skeleton className="h-4 w-4/6 bg-white/20" />
        <div className="flex items-center gap-4 mt-4">
          <Skeleton className="h-12 w-32 rounded-full bg-white/20" />
          <Skeleton className="h-12 w-32 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}

export function ErrorState({ title, message, onRetry }: { title: string; message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center min-h-[50vh]">
      <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
        <span className="text-3xl font-display font-bold">!</span>
      </div>
      <h2 className="text-2xl font-display font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md mb-8 text-balance">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors shadow-sm"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center min-h-[50vh]">
      <div className="w-20 h-20 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-6">
        <span className="text-3xl font-display font-bold">?</span>
      </div>
      <h2 className="text-2xl font-display font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md text-balance">{message}</p>
    </div>
  );
}
