"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Credenciales simuladas por rol
const credentialsByRole = [
  {
    role: "admin",
    email: "admin@logitrack.com",
    password: "admin123",
    permissions: {
      dashboard: true,
      production: true,
      suppliers: true,
      transport: true,
      config: true,
    },
  },
  {
    role: "supervisor",
    email: "supervisor@logitrack.com",
    password: "supervisor123",
    permissions: {
      dashboard: true,
      production: true,
      suppliers: true,
      transport: true,
      config: false,
    },
  },
  {
    role: "operario",
    email: "operario@logitrack.com",
    password: "operario123",
    permissions: {
      dashboard: false,
      production: true,
      suppliers: false,
      transport: false,
      config: false,
    },
  },
  {
    role: "proveedor",
    email: "proveedor@logitrack.com",
    password: "proveedor123",
    permissions: {
      dashboard: false,
      production: false,
      suppliers: true,
      transport: false,
      config: false,
    },
  },
  {
    role: "conductor",
    email: "conductor@logitrack.com",
    password: "conductor123",
    permissions: {
      dashboard: false,
      production: false,
      suppliers: false,
      transport: true,
      config: false,
    },
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    const credentials = credentialsByRole.find((cred) => cred.role === role);
    if (credentials) {
      setEmail(credentials.email);
      setPassword(credentials.password);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de autenticación
    setTimeout(() => {
      setIsLoading(false);
      const credentials = credentialsByRole.find((cred) => cred.role === selectedRole);
      
      if (credentials) {
        // Almacenar información del usuario y permisos en localStorage
        localStorage.setItem('userRole', credentials.role);
        localStorage.setItem('userPermissions', JSON.stringify(credentials.permissions));
        
        // Redirigir según los permisos
        if (credentials.permissions.dashboard) {
          router.push('/dashboard');
        } else if (credentials.permissions.production) {
          router.push('/production');
        } else if (credentials.permissions.suppliers) {
          router.push('/suppliers');
        } else if (credentials.permissions.transport) {
          router.push('/transport');
        }
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">LogiTrack</h2>
          <p className="text-muted-foreground">Sistema de Gestión Logística</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Selecciona un rol y usa las credenciales predefinidas</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Selecciona un Rol</Label>
                <Select onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Elige un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {credentialsByRole.map((cred) => (
                      <SelectItem key={cred.role} value={cred.role}>
                        {cred.role.charAt(0).toUpperCase() + cred.role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@empresa.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !selectedRole}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {selectedRole && (
          <div className="text-center text-sm text-muted-foreground">
            Rol seleccionado: <span className="font-medium capitalize">{selectedRole}</span>
          </div>
        )}
      </div>
    </div>
  );
}