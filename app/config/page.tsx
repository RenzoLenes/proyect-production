"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu, Upload, Clock, Users, Palette, Filter, Loader2 } from "lucide-react";
import SideBar from "@/components/sidebar";
import { useProcessStore } from "@/lib/store/processStore";
import { Process, SubProcess } from "@/types/process";
import { ProcessType } from "@/types/block";
import { RolesPermissions } from "@/components/config/RolesPermissions";
import { ProcessConfig } from "@/components/config/ProcessConfig";
import { Customization } from "@/components/config/Customization";
import { TipoConfeccionSelector } from "@/components/config/ConfeccionSelector";
import { useConfigStore } from "@/lib/store/configStore";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ConfigPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { processes, updateProcess, toggleProcess, addSubprocess, removeSubprocess } = useProcessStore();
  const [newSubprocessName, setNewSubprocessName] = useState("");
  const [editingSubprocess, setEditingSubprocess] = useState<SubProcess | null>(null);
  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);
  const { initializeTipoConfeccion } = useConfigStore();

  useEffect(() => {
    // Cuando cargues los tipos de confección
    initializeTipoConfeccion('001'); // O el valor por defecto que prefieras
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <SideBar isMobileOpen={isMobileOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-4 sm:p-8 lg:ml-64 transition-all duration-300 ease-in-out">
        {/* Top Bar */}
        <div className="bg-background border-b sticky top-0 z-10">
          <div className="container mx-auto px-2 sm:px-4 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-accent">
                  <Menu className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">Configuración</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Personalización del Sistema
                  </p>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <TipoConfeccionSelector />
                <Button variant="outline" size="icon">
                  <Filter className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-2 sm:px-4 pt-4 sm:pt-8">
          <Tabs defaultValue="roles" className="space-y-4 sm:space-y-8">
            <div className="overflow-x-auto">
              <TabsList className="flex w-full">
                <TabsTrigger
                  value="roles"
                  className="flex-1 text-xs sm:text-sm"
                >
                  <div className="flex items-center justify-center gap-2 w-full">
                    <Users className="h-4 w-4" />
                    <span>Roles y Permisos</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="processes"
                  className="flex-1 text-xs sm:text-sm"
                >
                  <div className="flex items-center justify-center gap-2 w-full">
                    <Clock className="h-4 w-4" />
                    <span>Procesos</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="customization"
                  className="flex-1 text-xs sm:text-sm"
                >
                  <div className="flex items-center justify-center gap-2 w-full">
                    <Palette className="h-4 w-4" />
                    <span>Personalización</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Roles y Permisos */}
            <TabsContent value="roles">
              <ScrollArea className="h-[calc(100vh-220px)] sm:h-[calc(100vh-210px)]">
                <Card className="p-4 sm:p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-8 sm:py-12 gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="font-medium">Cargando roles...</span>
                    </div>
                  ) : (
                    <RolesPermissions />
                  )}
                </Card>
              </ScrollArea>
            </TabsContent>

            {/* Procesos */}
            <TabsContent value="processes">
              <ScrollArea className="h-[calc(100vh-220px)] sm:h-[calc(100vh-210px)]">
                <Card className="p-4 sm:p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-8 sm:py-12 gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="font-medium">Cargando procesos...</span>
                    </div>
                  ) : (
                    <ProcessConfig />
                  )}
                </Card>
              </ScrollArea>
            </TabsContent>

            {/* Personalización */}
            <TabsContent value="customization">
              <ScrollArea className="h-[calc(100vh-220px)] sm:h-[calc(100vh-210px)]">
                <Card className="p-4 sm:p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-8 sm:py-12 gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="font-medium">Cargando opciones...</span>
                    </div>
                  ) : (
                    <Customization />
                  )}
                </Card>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}