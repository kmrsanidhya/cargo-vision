
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/AuthGuard";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ShipmentsPage from "./pages/ShipmentsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            } />
            <Route path="/shipments" element={
              <AuthGuard>
                <ShipmentsPage />
              </AuthGuard>
            } />
            
            {/* Add routes for other modules as they are developed */}
            <Route path="/packages" element={
              <AuthGuard>
                <DashboardPage /> {/* Placeholder - will be replaced */}
              </AuthGuard>
            } />
            <Route path="/carriers" element={
              <AuthGuard>
                <DashboardPage /> {/* Placeholder - will be replaced */}
              </AuthGuard>
            } />
            <Route path="/warehouses" element={
              <AuthGuard>
                <DashboardPage /> {/* Placeholder - will be replaced */}
              </AuthGuard>
            } />
            <Route path="/addresses" element={
              <AuthGuard>
                <DashboardPage /> {/* Placeholder - will be replaced */}
              </AuthGuard>
            } />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
