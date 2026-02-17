import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import Login from "./pages/Auth/Login";
import ProtectedRoute from "./pages/Auth/ProtectedRoute";
import GenerateFakeUsers from "./pages/GenerateFakeUsers";
import Patients from "./pages/Patients";
import EditPatient from "./pages/EditPatient";
import Appointments from "./pages/Appointment";
import Consultant from "./pages/Consultant";
import StaffPage from "./pages/Staff";
import SettingsPage from "./pages/Settings";
import PatientHistory from "./pages/PatientHistory";
import Prescription from "./pages/Prescription";
import ResetPassword from "./pages/ResetPassword";
import PACSViewer from "./pages/PACSViewer";
//import Technician from "./pages/Technician";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<Login />} />

            {/* Protected Routes - Token based only */}
            <Route
              path="/Home"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Index />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Patients />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-patient"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EditPatient />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient-history/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PatientHistory />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointment"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Appointments />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/consultant"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Consultant />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/patients/:id/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EditPatient />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/prescription/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Prescription />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="/pacs/:appointmentId" element={<PACSViewer />} />

            <Route
              path="/staff"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StaffPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SettingsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
