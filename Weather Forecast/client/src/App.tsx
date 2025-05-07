import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { Helmet } from "react-helmet";

// Pages
import HomePage from "@/pages/index";
import WeatherPage from "@/pages/weather/[city]";
import WeatherPageWithCountry from "@/pages/weather/[city]/[country]";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/weather/:city/:country" component={WeatherPageWithCountry} />
      <Route path="/weather/:city" component={WeatherPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Helmet>
            <title>Weather Forecast App</title>
            <meta name="description" content="Weather forecast web application providing real-time weather information for cities worldwide" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta property="og:title" content="Weather Forecast App" />
            <meta property="og:description" content="Check current weather and forecasts for cities worldwide" />
            <meta property="og:type" content="website" />
          </Helmet>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
