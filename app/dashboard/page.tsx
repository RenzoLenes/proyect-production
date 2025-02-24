"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bell, Settings, Factory, Truck, CheckCircle, AlertTriangle, Menu } from "lucide-react";
import SideBar from "@/components/sidebar";
import { useState } from "react";


const mockData = {
  efficiency: [
    { name: 'Corte', value: 85 },
    { name: 'Pre-Costura', value: 92 },
    { name: 'Armado', value: 78 },
    { name: 'Costura', value: 57 },
    { name: 'Pretinado', value: 43 },
    { name: 'Acabado', value: 95 },
  ],
  kpis: {
    inProduction: 156,
    inTransit: 43,
    completed: 892,
    delayed: 12
  },
  pendingTasks: [
    { id: 1, title: 'Revisar bloqueo en línea 3', priority: 'high' },
    { id: 2, title: 'Aprobar orden #45678', priority: 'medium' },
    { id: 3, title: 'Actualizar estado de envío', priority: 'low' },
  ]
};

export default function DashboardPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      <SideBar isMobileOpen={isMobileOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-8 lg:ml-64">
        <div className="container mx-auto px-4 py-4">

          <div className="flex justify-between items-center mb-8">

            <div className="flex items-center gap-4">
              <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-accent">
                <Menu className="h-6 w-6" />
              </button>

              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Estampados y Bordados S.A.
                </p>
              </div>
            </div>



            <div className="flex gap-4">
              <button className="relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  3
                </span>
              </button>
              <Settings className="w-6 h-6" />
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Factory className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">En Producción</p>
                  <h2 className="text-2xl font-bold">{mockData.kpis.inProduction}</h2>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Truck className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">En Tránsito</p>
                  <h2 className="text-2xl font-bold">{mockData.kpis.inTransit}</h2>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Completados</p>
                  <h2 className="text-2xl font-bold">{mockData.kpis.completed}</h2>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Con Retraso</p>
                  <h2 className="text-2xl font-bold">{mockData.kpis.delayed}</h2>
                </div>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Vista General</TabsTrigger>
              <TabsTrigger value="efficiency">Eficiencia</TabsTrigger>
              <TabsTrigger value="tasks">Tareas</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Eficiencia por Área</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockData.efficiency}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Tareas Pendientes</h3>
                  <div className="space-y-4">
                    {mockData.pendingTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <span className="flex-1">{task.title}</span>
                        <span className={`px-2 py-1 rounded text-xs ${task.priority === 'high' ? 'bg-destructive text-destructive-foreground' :
                          task.priority === 'medium' ? 'bg-orange-500 text-white' :
                            'bg-green-500 text-white'}`}>
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}