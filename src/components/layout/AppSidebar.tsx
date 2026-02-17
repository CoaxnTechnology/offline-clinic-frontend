import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

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

interface NavItem {
  key: string;
  url: string;
  icon: React.ComponentType<any>;
  subItems?: { title: string; url: string }[];
  hasSubmenu?: boolean;
}

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { t } = useTranslation();

  // 🔥 Detect RTL
  const isRTL = i18n.language === "ar";

  const navigationItems: NavItem[] = [
    { key: "dashboard", url: "/Home", icon: LayoutDashboard },
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
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:border-blue-500"
    );

  return (
    <Sidebar
      className={cn(
        "border-sidebar-border transition-smooth bg-gradient-sidebar",
        collapsed ? "w-14" : "w-64",

        // ✅ Position Control Based On Language
        isRTL
          ? "border-l !left-auto !right-0"
          : "border-r left-0"
      )}
      collapsible="icon"
    >
      {/* HEADER */}
      <SidebarHeader className="p-4 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-elegant">
            <span className="text-white font-bold text-lg">EE</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sidebar-foreground font-bold text-xl tracking-tight">
                {t("hospitalName")}
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
                <div key={item.key}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={getNavCls}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && (
                          <span className="truncate">
                            {t(item.key)}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
