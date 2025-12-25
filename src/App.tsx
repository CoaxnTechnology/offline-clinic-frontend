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
import Userdetails from "./pages/Userdetails";
import Servicedetails from "./pages/Servicedetails";
import Service from "./pages/Service";
import GenerateFakeUsers from "./pages/GenerateFakeUsers";
import EditProfile from "./pages/Editprofile";
import CreateService from "./pages/CreateService";
import Payment from "./pages/Payment";
import AllBookings from "./pages/Booking";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointment";
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
              path="/service/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Servicedetails />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/service"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Service />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/FakeUser"
              element={
                <ProtectedRoute>
                  <Layout>
                    <GenerateFakeUsers />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-user/:userId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EditProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-service/:userId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CreateService />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Payment />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AllBookings />
                  </Layout>
                </ProtectedRoute>
              }
            />
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
