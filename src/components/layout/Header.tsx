import { FC, useEffect } from "react";
import {
  BellRinging,
  GearSix,
  UserCircle,
  Globe,
} from "phosphor-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";



export const Header: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Get admin name from localStorage
  const admin = localStorage.getItem("admin");
  const adminName = admin ? JSON.parse(admin).name : "Admin";

  // Apply RTL automatically
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(savedLang);
    document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };


  const handleLogout = () => {
  console.log("🚪 Logging out... clearing storage");

  localStorage.clear();   // ✅ sab remove
  sessionStorage.clear(); // (agar use hota ho)

  navigate("/", { replace: true });
};


  return (
    <header className="h-16 border-b border-border bg-blue-600 text-white shadow-sm">
      <div className="flex h-full items-center justify-between px-4 gap-2 sm:gap-4">
        {/* Left - Sidebar */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <SidebarTrigger className="hover:bg-blue-700 text-white shrink-0" />
        </div>

        {/* Right - Icons & User */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          

          {/* Language Switch */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-blue-700 text-white"
              >
                <Globe size={22} weight="bold" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40 bg-white text-black">
              <DropdownMenuItem
                onClick={() => changeLanguage("en")}
                className={
                  i18n.language === "en" ? "font-semibold bg-muted" : ""
                }
              >
                English
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => changeLanguage("ar")}
                className={
                  i18n.language === "ar" ? "font-semibold bg-muted" : ""
                }
              >
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenuSeparator className="h-6 w-px bg-white/40 mx-2 hidden sm:block" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 py-2 h-10 hover:bg-blue-700 text-white"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <UserCircle size={24} weight="fill" />
                </div>

                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold truncate max-w-[100px]">
                    {adminName}
                  </div>
                  <div className="text-xs text-white/80">
                    {t("administrator")}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 bg-white text-black">
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" />
                {t("profile")}
              </DropdownMenuItem>

              {/* <DropdownMenuItem>
                <GearSix className="mr-2 h-4 w-4" />
                {t("settings")}
              </DropdownMenuItem> */}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600"
                onClick={handleLogout}
              >
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
