import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from 'wagmi';
import { ConnectKitProvider } from 'connectkit';
import { config } from './config/wagmi';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <ConnectKitProvider
        theme="auto"
        mode="light"
        customTheme={{
          "--ck-font-family": "Inter, sans-serif",
          "--ck-border-radius": "12px",
          "--ck-accent-color": "hsl(217 91% 60%)",
          "--ck-accent-text-color": "hsl(0 0% 100%)",
        }}
      >
        <TooltipProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'glass-card border-border/50',
            }}
          />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ConnectKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
