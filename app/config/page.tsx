"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import SideBar from "@/components/sidebar";
import { Menu } from "lucide-react";

export default function ConfigPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      <SideBar isMobileOpen={isMobileOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-8 lg:ml-64">
        <div className="container mx-auto px-4 py-4">

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-accent">
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Configuración</h1>
                <p className="text-sm text-muted-foreground">
                  Estampados y Bordados S.A.
                </p>
              </div>

            </div>

          </div>

          <Tabs defaultValue="roles" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
              <TabsTrigger value="roles">Roles y Permisos</TabsTrigger>
              <TabsTrigger value="processes">Procesos</TabsTrigger>
              <TabsTrigger value="modules">Módulos</TabsTrigger>
            </TabsList>

            <TabsContent value="roles">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Gestión de Roles</h2>
                    <Button>Nuevo Rol</Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rol</TableHead>
                        <TableHead>Dashboard</TableHead>
                        <TableHead>Producción</TableHead>
                        <TableHead>Reportes</TableHead>
                        <TableHead>Configuración</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Administrador</TableCell>
                        <TableCell><Switch checked /></TableCell>
                        <TableCell><Switch checked /></TableCell>
                        <TableCell><Switch checked /></TableCell>
                        <TableCell><Switch checked /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Supervisor</TableCell>
                        <TableCell><Switch checked /></TableCell>
                        <TableCell><Switch checked /></TableCell>
                        <TableCell><Switch checked /></TableCell>
                        <TableCell><Switch /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Operador</TableCell>
                        <TableCell><Switch checked /></TableCell>
                        <TableCell><Switch checked /></TableCell>
                        <TableCell><Switch /></TableCell>
                        <TableCell><Switch /></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="processes">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Procesos de Producción</h2>
                    <Button>Nuevo Proceso</Button>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-4 border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Corte</h3>
                        <Switch checked />
                      </div>
                      <div className="pl-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Input placeholder="Nuevo subproceso" className="w-64" />
                          <Button variant="outline">Agregar</Button>
                        </div>
                        <ul className="space-y-2">
                          <li className="flex items-center justify-between">
                            <span>Tendido</span>
                            <Button variant="ghost" size="sm">Eliminar</Button>
                          </li>
                          <li className="flex items-center justify-between">
                            <span>Trazado</span>
                            <Button variant="ghost" size="sm">Eliminar</Button>
                          </li>
                          <li className="flex items-center justify-between">
                            <span>Corte</span>
                            <Button variant="ghost" size="sm">Eliminar</Button>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4 border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Confección</h3>
                        <Switch checked />
                      </div>
                      <div className="pl-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Input placeholder="Nuevo subproceso" className="w-64" />
                          <Button variant="outline">Agregar</Button>
                        </div>
                        <ul className="space-y-2">
                          <li className="flex items-center justify-between">
                            <span>Ensamble</span>
                            <Button variant="ghost" size="sm">Eliminar</Button>
                          </li>
                          <li className="flex items-center justify-between">
                            <span>Costura</span>
                            <Button variant="ghost" size="sm">Eliminar</Button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="modules">
              <Card className="p-6">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Módulos del Sistema</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label>Control de Calidad</Label>
                        <p className="text-sm text-muted-foreground">
                          Gestión de inspecciones y reportes de calidad
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label>Integración ERP</Label>
                        <p className="text-sm text-muted-foreground">
                          Sincronización con PowerBuilder
                        </p>
                      </div>
                      <Switch checked />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label>Gestión de Proveedores</Label>
                        <p className="text-sm text-muted-foreground">
                          Control de proveedores externos y servicios
                        </p>
                      </div>
                      <Switch checked />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label>Reportes Avanzados</Label>
                        <p className="text-sm text-muted-foreground">
                          Análisis detallado y exportación de datos
                        </p>
                      </div>
                      <Switch checked />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}