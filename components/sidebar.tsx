"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Package,
  ArrowUpDown,
  Truck,
  Users,
  ChevronLeft,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button"; // Asegúrate de importar el botón
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { useConfigStore } from "@/lib/store/configStore";
import { CompanyInfo } from "./CompanyInfo";
import { NavItems } from "./NavItems";
import { UserPermissions } from "@/types/user";
import { useRolesStore } from "@/lib/store/roleStore";
import { useUserStore } from "@/lib/store/userStore";

interface CompanyInfo {
  name: string;
  logo?: string;
}


export default function SideBar({
  isMobileOpen,
  toggleSidebar,
}: {
  isMobileOpen: boolean;
  toggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { colors } = useConfigStore();
  const { roles } = useRolesStore();
  const { role: currentRoleName, clear: clearUser } = useUserStore();
  const currentRole = roles.find(role => role.name === currentRoleName);
  const permissions = currentRole?.permissions || {
    dashboard: false,
    production: false,
    suppliers: false,
    transport: false,
    config: false
  };



  const handleLogout = async () => {
    setTimeout(() => {
      clearUser();
      router.push("/auth/login");
    }, 500);
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/dashboard",
      show: permissions?.dashboard,
    },
    {
      label: "Producción",
      icon: <Package className="h-5 w-5" />,
      href: "/production",
      show: permissions?.production,
    },
    {
      label: "Externos",
      icon: <ArrowUpDown className="h-5 w-5" />,
      href: "/suppliers",
      show: permissions?.suppliers,
    },
    {
      label: "Transporte",
      icon: <Truck className="h-5 w-5" />,
      href: "/transport",
      show: permissions?.transport,
    },
    {
      label: "Configuración",
      icon: <Settings className="h-5 w-5" />,
      href: "/config",
      show: permissions?.config,
    },
  ];
  const visibleNavItems = navItems.filter((item) => item.show);

  return (
    <>
      {/* Versión Desktop */}
      <div 
        className="hidden lg:flex flex-col fixed h-screen w-64 bg-background border-r p-6 justify-between"
      >
        {/* Logo y Menú */}
        <div>
          {/* LogiTrack Brand */}
          <div className="flex items-center gap-3 mb-4">
            <Truck className="h-8 w-8 text-primary" />
            <h2 className="text-xl font-bold">LogiTrack</h2>
          </div>

          <Separator className="mb-4" />

          {/* Company Info */}
          <CompanyInfo />

          <NavItems items={navItems} />
        </div>

        {/* Botón de Cerrar Sesión al final */}
        <div className="border-t p-3">
          <Button
            variant="ghost"
            className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-red-500 hover:text-white transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </div>

      {/* Versión Mobile */}
      <div
        className={`lg:hidden fixed h-screen w-16 bg-background border-r transform transition-transform z-40 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4 flex flex-col items-center h-full justify-between">
          <div className="space-y-4">
            <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-accent">
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* LogiTrack Icon */}
            <div className="p-2">
              <Truck className="h-6 w-6 text-primary" />
            </div>

            <Separator className="w-8 mx-auto" />

            {/* Company Logo/Initial */}
            <CompanyInfo mobile />
          </div>

          <nav className="flex-1 flex flex-col items-center space-y-6">
            <NavItems
              items={navItems}
              mobile
              permissions={permissions}
            />
          </nav>

          {/* Botón de Cerrar Sesión en versión móvil */}
          <div className="mt-auto p-4">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center p-2 hover:bg-red-500 hover:text-white transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}