import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import GameCanvas from "@/components/GameCanvas";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <GameCanvas />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

import ErrorBoundary from "./components/ErrorBoundary";

export default App;
