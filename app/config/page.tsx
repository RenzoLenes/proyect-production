"use client";

import { useState } from "react";
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
import { Menu, Upload, Clock, Users, Palette } from "lucide-react";
import SideBar from "@/components/sidebar";
import { useProcessStore } from "@/lib/store/processStore";
import { Process, SubProcess } from "@/types/process";
import { ProcessType } from "@/types/block";
import { RolesPermissions } from "@/components/config/RolesPermissions";
import { ProcessConfig } from "@/components/config/ProcessConfig";
import { Customization } from "@/components/config/Customization";


export default function ConfigPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [companyName, setCompanyName] = useState("Mi Empresa");
  const [logoUrl, setLogoUrl] = useState("");
  const { processes, updateProcess, toggleProcess, addSubprocess, removeSubprocess } = useProcessStore();
  const [newSubprocessName, setNewSubprocessName] = useState("");
  const [editingSubprocess, setEditingSubprocess] = useState<SubProcess | null>(null);
  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);



  return (
    <>
      <SideBar isMobileOpen={isMobileOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-8 lg:ml-64">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-accent"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Configuración</h1>
                <p className="text-sm text-muted-foreground">
                  Personalización del Sistema
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="roles" className="space-y-8">
            <TabsList className="flex w-full overflow-x-auto justify-evenly">
              <TabsTrigger
                value="roles"
                className="flex items-center gap-2 px-4 py-2 whitespace-nowrap min-w-[180px] justify-center"
              >
                <Users className="h-4 w-4" />
                <span>Roles y Permisos</span>
              </TabsTrigger>

              <TabsTrigger
                value="processes"
                className="flex items-center gap-2 px-4 py-2 whitespace-nowrap min-w-[180px] justify-center"
              >
                <Clock className="h-4 w-4" />
                <span>Procesos</span>
              </TabsTrigger>

              <TabsTrigger
                value="customization"
                className="flex items-center gap-2 px-4 py-2 whitespace-nowrap min-w-[180px] justify-center"
              >
                <Palette className="h-4 w-4" />
                <span>Personalización</span>
              </TabsTrigger>
            </TabsList>

            {/* Roles y Permisos */}
            <TabsContent value="roles">
              <Card className="p-6">
                <RolesPermissions/>
              </Card>
            </TabsContent>



            {/* Procesos */}
            <TabsContent value="processes">
              <Card className="p-6">
                <ProcessConfig/>
              </Card>
            </TabsContent>

            {/* Procesos */}

            {/* Personalización */}
            <TabsContent value="customization">
              <Card className="p-6">
                <Customization/>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}