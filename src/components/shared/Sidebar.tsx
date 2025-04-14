"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Package, ArrowUpDown, Truck, Settings, ChevronLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import { CompanyInfo } from "./CompanyInfo";
import { Separator } from "../ui/separator";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  permission: boolean;
}

export default function SideBar({
  isMobileOpen,
  toggleSidebar,
}: {
  isMobileOpen: boolean;
  toggleSidebar: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { role, permissions, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirigir a login y forzar recarga completa
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/dashboard",
      permission: permissions?.dashboard || false,
    },
    {
      label: "Producción",
      icon: <Package className="h-5 w-5" />,
      href: "/production",
      permission: permissions?.production || false,
    },
    {
      label: "Externos",
      icon: <ArrowUpDown className="h-5 w-5" />,
      href: "/suppliers",
      permission: permissions?.suppliers || false,
    },
    {
      label: "Transporte",
      icon: <Truck className="h-5 w-5" />,
      href: "/transport",
      permission: permissions?.transport || false,
    },
    {
      label: "Configuración",
      icon: <Settings className="h-5 w-5" />,
      href: "/config",
      permission: permissions?.config || false,
    },
  ];

  const filteredNavItems = navItems.filter(item => item.permission);

  return (
    <>
      {/* Versión Desktop */}
      <div className="hidden lg:flex flex-col fixed h-screen w-64 bg-background border-r p-6 justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Truck className="h-8 w-8 text-primary" />
            <h2 className="text-xl font-bold">LogiTrack</h2>
          </div>

          <Separator className="mb-4" />

          <CompanyInfo />

          <nav className="space-y-1 mt-6">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

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
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-accent"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="p-2">
              <Truck className="h-6 w-6 text-primary" />
            </div>

            <Separator className="w-8 mx-auto" />

            <CompanyInfo mobile />
          </div>

          <nav className="flex-1 flex flex-col items-center space-y-6 mt-6">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`p-2 rounded-lg transition-colors ${pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                {item.icon}
              </Link>
            ))}
          </nav>

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