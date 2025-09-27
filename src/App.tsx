import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SimpleAuthProvider } from "./contexts/SimpleAuthContext";
import { RealtimeDataProvider } from "./contexts/RealtimeDataContext";
import { SimpleProtectedRoute, SimplePublicRoute } from "./components/SimpleProtectedRoute";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { Features } from "./pages/Features";
import { Careers } from "./pages/Careers";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";
import { FirebaseSetup } from "./pages/FirebaseSetup";
import { SimpleAdminLogin } from "./pages/SimpleAdminLogin";
import { SimpleAdminDashboard } from "./pages/SimpleAdminDashboard";
import { SimpleAdminProducts } from "./pages/SimpleAdminProducts";
import { SimpleAdminMachinery } from "./pages/SimpleAdminMachinery";
import { SimpleAdminCustomers } from "./pages/SimpleAdminCustomers";
import { SimpleAdminCompany } from "./pages/SimpleAdminCompany";
import { SimpleAdminJobs } from "./pages/SimpleAdminJobs";
import { SimpleAdminContacts } from "./pages/SimpleAdminContacts";
import { SimpleAdminApplications } from "./pages/SimpleAdminApplications";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { LoadingProgress } from "./components/LoadingProgress";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { DataRefreshButton } from "./components/DataRefreshButton";
import { useRealtimeData } from "./contexts/RealtimeDataContext";

function AppContent() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <SimplePublicRoute>
              <Header />
              <Home />
              <Footer />
            </SimplePublicRoute>
          } />
          <Route path="/about" element={
            <SimplePublicRoute>
              <Header />
              <About />
              <Footer />
            </SimplePublicRoute>
          } />
          <Route path="/services" element={
            <SimplePublicRoute>
              <Header />
              <Services />
              <Footer />
            </SimplePublicRoute>
          } />
          <Route path="/features" element={
            <SimplePublicRoute>
              <Header />
              <Features />
              <Footer />
            </SimplePublicRoute>
          } />

          <Route path="/careers" element={
            <SimplePublicRoute>
              <Header />
              <Careers />
              <Footer />
            </SimplePublicRoute>
          } />
          <Route path="/contact" element={
            <SimplePublicRoute>
              <Header />
              <Contact />
              <Footer />
            </SimplePublicRoute>
          } />
          
          {/* Firebase Setup Route */}
          <Route path="/firebase-setup" element={
            <SimplePublicRoute>
              <FirebaseSetup />
            </SimplePublicRoute>
          } />
          
          {/* Admin Routes - Simple & Working */}
          <Route path="/admin" element={
            <SimplePublicRoute>
              <SimpleAdminLogin />
            </SimplePublicRoute>
          } />
          <Route path="/admin/login" element={
            <SimplePublicRoute>
              <SimpleAdminLogin />
            </SimplePublicRoute>
          } />
          <Route path="/admin/dashboard" element={
            <SimpleProtectedRoute>
              <ErrorBoundary>
                <SimpleAdminDashboard />
              </ErrorBoundary>
            </SimpleProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <SimpleProtectedRoute>
              <ErrorBoundary>
                <SimpleAdminProducts />
              </ErrorBoundary>
            </SimpleProtectedRoute>
          } />
          <Route path="/admin/machinery" element={
            <SimpleProtectedRoute>
              <ErrorBoundary>
                <SimpleAdminMachinery />
              </ErrorBoundary>
            </SimpleProtectedRoute>
          } />
          <Route path="/admin/customers" element={
            <SimpleProtectedRoute>
              <ErrorBoundary>
                <SimpleAdminCustomers />
              </ErrorBoundary>
            </SimpleProtectedRoute>
          } />
          <Route path="/admin/jobs" element={
            <SimpleProtectedRoute>
              <ErrorBoundary>
                <SimpleAdminJobs />
              </ErrorBoundary>
            </SimpleProtectedRoute>
          } />
          <Route path="/admin/contacts" element={
            <SimpleProtectedRoute>
              <ErrorBoundary>
                <SimpleAdminContacts />
              </ErrorBoundary>
            </SimpleProtectedRoute>
          } />
          <Route path="/admin/applications" element={
            <SimpleProtectedRoute>
              <ErrorBoundary>
                <SimpleAdminApplications />
              </ErrorBoundary>
            </SimpleProtectedRoute>
          } />
          <Route path="/admin/company" element={
            <SimpleProtectedRoute>
              <ErrorBoundary>
                <SimpleAdminCompany />
              </ErrorBoundary>
            </SimpleProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={
            <SimplePublicRoute>
              <Header />
              <NotFound />
              <Footer />
            </SimplePublicRoute>
          } />
      </Routes>
      <ConnectionStatus />
      <DataRefreshButton />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <SimpleAuthProvider>
        <RealtimeDataProvider>
          <AppContent />
        </RealtimeDataProvider>
      </SimpleAuthProvider>
    </Router>
  );
}
