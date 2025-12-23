import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { StatsGrid } from "@/components/dashboard/StatsGrid";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        {/* <AppSidebar /> */}

        <div className="flex-1 flex flex-col">
          {/* Header */}
          {/* <Header /> */}

          <main className="flex-1 p-6 space-y-6">
            {/* Page Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Expert Echo Dashboard
              </h1>
              <p className="text-muted-foreground">
                A centralized medical management system to handle patient
                appointments, diagnostics, reports, and treatment workflows
                efficiently with real-time visibility.
              </p>
            </div>

            {/* Dashboard Stats */}
            <StatsGrid />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
