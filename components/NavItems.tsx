'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserPermissions } from "@/types/user";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  show?: boolean;
}

interface NavItemsProps {
  items: NavItem[];
  permissions?: UserPermissions;
  mobile?: boolean;
}

export const NavItems = ({ items, permissions, mobile = false }: NavItemsProps) => {
  const pathname = usePathname();
  
  return (
    <nav className={mobile ? "flex-1 flex flex-col items-center space-y-6" : "space-y-2"}>
      {items
        .filter(item => permissions?.[item.show as unknown as keyof UserPermissions] ?? true)
        .map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              mobile ? "p-2 rounded-lg" : "flex items-center gap-3 px-4 py-3 rounded-lg text-primary",
              pathname === item.href ? "bg-accent text-primary" : "hover:bg-accent"
            )}
          >
            {mobile ? item.icon : <>{item.icon}<span>{item.label}</span></>}
          </Link>
        ))}
    </nav>
  );
};