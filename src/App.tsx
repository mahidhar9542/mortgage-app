import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { RatesProvider } from '@/contexts/RatesContext';
import { ApplicationProvider } from '@/contexts/ApplicationContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import Index from "./pages/Index";
import ApplyNow from "./pages/ApplyNow";
import ThankYou from "./pages/ThankYou";
import SignIn from "./pages/auth/signin";
import SignUp from "./pages/auth/signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from "./pages/NotFound";
import RatesPage from "./pages/RatesPage";
import ApplicationSubmitted from "./pages/ApplicationSubmitted";
import PurchasePage from "./pages/PurchasePage";
import RefinancePage from "./pages/RefinancePage";
import HomeEquityPage from "./pages/HomeEquityPage";

const queryClient = new QueryClient();

function AppContent() {
  return (
    <div className="min-h-screen bg-background">
      <AppRoutes />
      <Toaster position="top-right" />
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/apply" element={<ApplyNow />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/purchase" element={<PurchasePage />} />
      <Route path="/refinance" element={<RefinancePage />} />
      <Route path="/equity" element={<HomeEquityPage />} />
      
      {/* Auth Routes */}
      <Route path="/auth/signin" element={
        <PublicRoute>
          <SignIn />
        </PublicRoute>
      } />
      
      <Route path="/auth/signup" element={
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      } />
      
      <Route path="/auth/forgot-password" element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      } />
      
      <Route path="/auth/reset-password" element={
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      } />
      
      {/* Application Flow */}
      <Route path="/apply" element={
        <ApplicationProvider>
          <ApplyNow />
        </ApplicationProvider>
      } />
      
      <Route path="/apply/refinance" element={
        <ApplicationProvider>
          <ApplyNow />
        </ApplicationProvider>
      } />
      
      <Route path="/apply/purchase" element={
        <ApplicationProvider>
          <ApplyNow />
        </ApplicationProvider>
      } />
      
      <Route path="/application-submitted" element={
        <ApplicationProvider>
          <ApplicationSubmitted />
        </ApplicationProvider>
      } />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      <Route path="/rates" element={
        <ProtectedRoute>
          <RatesPage />
        </ProtectedRoute>
      } />
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RatesProvider>
            <TooltipProvider>
              <ApplicationProvider>
                <AppContent />
              </ApplicationProvider>
            </TooltipProvider>
          </RatesProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
