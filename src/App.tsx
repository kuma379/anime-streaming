import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import Home from "@/pages/Home";
import Schedule from "@/pages/Schedule";
import Watch from "@/pages/Watch";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route>
        <>
          <Navbar />
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/jadwal" component={Schedule} />
            <Route path="/tonton/:slug" component={Watch} />
            <Route component={NotFound} />
          </Switch>
        </>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
