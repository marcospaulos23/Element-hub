import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDevToolsProtection } from "@/hooks/useDevToolsProtection";
import { useSecurityHeaders } from "@/hooks/useSecurityHeaders";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import HowToUse from "./pages/HowToUse";
import WhatsNew from "./pages/WhatsNew";
import Settings from "./pages/Settings";
import AccessPending from "./pages/AccessPending";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useDevToolsProtection();
  useSecurityHeaders();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/repository" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/how-to-use" element={<HowToUse />} />
        <Route path="/whats-new" element={<WhatsNew />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/access-pending" element={<AccessPending />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
