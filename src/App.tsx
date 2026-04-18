import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import MarketplaceSection from "./components/dashboard/MarketplaceSection";
import SafePlaceSection from "./components/dashboard/SafePlaceSection";
import PrintOnDemand from "./pages/dashboard/PrintOnDemand";
import Orders from "./pages/dashboard/Orders";
import SourcingRequest from "./pages/dashboard/SourcingRequest";
import Products from "./pages/dashboard/Products";
import CustomerSupport from "./pages/dashboard/CustomerSupport";
import Messages from "./pages/dashboard/Messages";
import AdminProducts from "./pages/AdminProducts";
import Cart from "./pages/dashboard/Cart";
import Favorites from "./pages/dashboard/Favorites";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireOnboarding>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="marketplace" replace />} />
              <Route path="marketplace" element={<MarketplaceSection />} />
              <Route path="print-on-demand" element={<PrintOnDemand />} />
              <Route path="orders" element={<Orders />} />
              <Route path="sourcing" element={<SourcingRequest />} />
              <Route path="products" element={<Products />} />
              <Route path="safe-place" element={<SafePlaceSection />} />
              <Route path="support" element={<CustomerSupport />} />
              <Route path="messages" element={<Messages />} />
              <Route path="admin" element={<AdminProducts />} />
              <Route path="cart" element={<Cart />} />
              <Route path="favorites" element={<Favorites />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
