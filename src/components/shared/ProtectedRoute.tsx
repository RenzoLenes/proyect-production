"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export default function ProtectedRoute({
  children,
  requiredPermission
}: {
  children: React.ReactNode;
  requiredPermission?: keyof {
    dashboard: boolean;
    production: boolean;
    suppliers: boolean;
    transport: boolean;
    config: boolean;
  };
}) {
  const router = useRouter();
  const { isAuthenticated, permissions } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
    } else if (requiredPermission && !permissions?.[requiredPermission]) {
      router.push('/');
    }
  }, [isAuthenticated, permissions, requiredPermission, router]);

  if (!isAuthenticated() || (requiredPermission && !permissions?.[requiredPermission])) {
    return null; // O un componente de carga
  }

  return <>{children}</>;
}