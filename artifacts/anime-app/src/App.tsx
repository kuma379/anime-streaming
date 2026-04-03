import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SearchPage from "@/pages/search";
import OngoingPage from "@/pages/ongoing";
import CompletedPage from "@/pages/completed";
import PopularPage from "@/pages/popular";
import MoviesPage from "@/pages/movies";
import SchedulePage from "@/pages/schedule";
import GenresPage from "@/pages/genres";
import GenreDetailPage from "@/pages/genre-detail";
import BatchPage from "@/pages/batch";
import AnimeDetailPage from "@/pages/anime-detail";
import WatchPage from "@/pages/watch";
import AdminPage from "@/pages/admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={AdminPage} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/search" component={SearchPage} />
            <Route path="/ongoing" component={OngoingPage} />
            <Route path="/completed" component={CompletedPage} />
            <Route path="/popular" component={PopularPage} />
            <Route path="/movies" component={MoviesPage} />
            <Route path="/schedule" component={SchedulePage} />
            <Route path="/genres" component={GenresPage} />
            <Route path="/genres/:genre" component={GenreDetailPage} />
            <Route path="/batch" component={BatchPage} />
            <Route path="/anime/:slug" component={AnimeDetailPage} />
            <Route path="/watch/:episodeId" component={WatchPage} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
