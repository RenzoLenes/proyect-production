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

interface UserPermissions {
  dashboard: boolean;
  production: boolean;
  suppliers: boolean;
  transport: boolean;
  config: boolean;
}

export default function SideBar({
  isMobileOpen,
  toggleSidebar,
}: {
  isMobileOpen: boolean;
  toggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userPermissions = localStorage.getItem("userPermissions");
    if (userPermissions) {
      setPermissions(JSON.parse(userPermissions));
    }
  }, []);

  const handleLogout = async () => {
    setTimeout(() => {
      localStorage.removeItem("userRole");
      localStorage.removeItem("userPermissions");
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
      <div className="hidden lg:flex flex-col fixed h-screen w-64 bg-background border-r p-6 justify-between">
        {/* Logo y Menú */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Truck className="h-8 w-8 text-primary" />
            <h2 className="text-xl font-bold">LogiTrack</h2>
          </div>
          <nav className="space-y-2">
            {visibleNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
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
        className={`lg:hidden fixed h-screen w-16 bg-background border-r transform transition-transform z-40 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex flex-col items-center h-full justify-between">
          <button onClick={toggleSidebar} className="p-2 mb-8 rounded-lg hover:bg-accent">
            <ChevronLeft className="h-6 w-6" />
          </button>

          <nav className="flex-1 flex flex-col items-center space-y-6">
            {visibleNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`p-2 rounded-lg ${
                  pathname === item.href ? "bg-accent" : "hover:bg-accent"
                }`}
              >
                {item.icon}
              </Link>
            ))}
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
