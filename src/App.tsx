import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Prielbrusye from "./pages/Prielbrusye";
import Aktivnosti from "./pages/Aktivnosti";
import Apartments from "./pages/Apartments";
import ApartmentDetail from "./pages/ApartmentDetail";
import Cafes from "./pages/Cafes";
import CafeDetail from "./pages/CafeDetail";
import Taxi from "./pages/Taxi";
import TaxiDetail from "./pages/TaxiDetail";
import Cameras from "./pages/Cameras";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main pages with header/footer */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/prielbrusye" element={<Prielbrusye />} />
              <Route path="/aktivnosti" element={<Aktivnosti />} />
              <Route path="/apartments" element={<Apartments />} />
              <Route path="/apartments/:slug" element={<ApartmentDetail />} />
              <Route path="/cafes" element={<Cafes />} />
              <Route path="/cafes/:slug" element={<CafeDetail />} />
              <Route path="/taxi" element={<Taxi />} />
              <Route path="/taxi/:slug" element={<TaxiDetail />} />
              <Route path="/cameras" element={<Cameras />} />
            </Route>

            {/* Auth pages without header/footer */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
