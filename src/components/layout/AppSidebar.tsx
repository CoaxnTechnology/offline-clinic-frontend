import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { jwtDecode } from "jwt-decode";

import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Activity,
  CalendarCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

/* =====================
   JWT TYPE
===================== */
interface DecodedToken {
  clinic_id?: number;
  role?: string;
  exp: number;
}

interface NavItem {
  key: string;
  url: string;
  icon: React.ComponentType<any>;
}

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const { t } = useTranslation();

  // 🔥 Detect RTL
  const isRTL = i18n.language === "ar";

  /* =====================
     CLINIC DATA
  ===================== */
  const [clinicName, setClinicName] = useState<string>("Hospital");
  const [clinicLogo, setClinicLogo] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const decoded = jwtDecode<DecodedToken>(token);
    const clinicId = decoded.clinic_id;

    // Superadmin ke liye clinic optional
    if (!clinicId) return;

    fetch(`https://api.clinicalgynecologists.space/api/clinics/${clinicId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (!data?.success) return;

        setClinicName(data.data.name || "Hospital");

        // 🔥 Load logo with auth (because protected)
        if (data.data.logo_url) {
          const logoRes = await fetch(data.data.logo_url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const blob = await logoRes.blob();
          setClinicLogo(URL.createObjectURL(blob));
        }
      })
      .catch(() => {});
  }, []);

  const navigationItems: NavItem[] = [
   // { key: "dashboard", url: "/Home", icon: LayoutDashboard },
    { key: "patients", url: "/patients", icon: Users },
    { key: "appointment", url: "/appointment", icon: CalendarCheck },
    { key: "consultant", url: "/consultant", icon: Stethoscope },
    { key: "staff", url: "/staff", icon: Activity },
    { key: "settings", url: "/settings", icon: Settings },
  ];

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth relative",
      isActive
        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:border-blue-500",
    );

  return (
    <Sidebar
      className={cn(
        "border-sidebar-border transition-smooth bg-gradient-sidebar",
        collapsed ? "w-14" : "w-64",
        isRTL ? "border-l !left-auto !right-0" : "border-r left-0",
      )}
      collapsible="icon"
    >
      {/* HEADER */}
      <SidebarHeader className="p-4 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-elegant overflow-hidden">
            {clinicLogo ? (
              <img
                src={clinicLogo}
                alt="logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-white font-bold text-lg">EE</span>
            )}
          </div>

          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sidebar-foreground font-bold text-base leading-tight break-words line-clamp-2">
                {clinicName}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 uppercase tracking-wider text-xs font-semibold mb-3">
            {t("menu")}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="truncate">{t(item.key)}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
