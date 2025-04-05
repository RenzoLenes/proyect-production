"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, PieChart, Pie, Cell, BarChart } from 'recharts';
import { Bell, Settings, Factory, Truck, CheckCircle, AlertTriangle, Menu, Filter, Search, Clock, ArrowUp, ArrowDown, X } from "lucide-react";
import SideBar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { useProductionStore } from "@/lib/store/productionStore";
import { mockBlocks } from "@/data/mockBlocks";
import { processes } from "@/types/process";
import { useProcessStore } from "@/lib/store/processStore";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEmpresaById } from "@/actions/empresa/crud-empresa";
import { MovimientoProcesoResultado } from '../../interfaces/movproceso.interface';
import { obtenerMovimientosPendientes } from '../../actions/procesoc/crud-movprocesoc';
const mockData = {
  notifications: [
    {
      id: 1,
      title: "Retraso en entrega",
      description: "El envío #78910 ha superado el tiempo estimado",
      type: "alert",
      time: "Hace 10 minutos",
      unread: true
    },
    {
      id: 2,
      title: "Nueva orden programada",
      description: "Se ha agendado el envío de la orden #45678 para mañana",
      type: "info",
      time: "Hace 30 minutos",
      unread: true
    },
    {
      id: 3,
      title: "Actualización de costos",
      description: "Se han actualizado las tarifas de transporte externo",
      type: "info",
      time: "Hace 2 horas",
      unread: false
    }
  ],
  efficiency: [
    { name: 'Corte', value: 85 },
    { name: 'Pre-Costura', value: 92 },
    { name: 'Armado', value: 78 },
    { name: 'Costura', value: 57 },
    { name: 'Pretinado', value: 43 },
    { name: 'Acabado', value: 95 },
  ],
  weeklyEfficiency: [
    { day: 'Lun', efficiency: 78 },
    { day: 'Mar', efficiency: 82 },
    { day: 'Mie', efficiency: 85 },
    { day: 'Jue', efficiency: 76 },
    { day: 'Vie', efficiency: 89 },
  ],
  processDistribution: [
    { name: 'En Tiempo', value: 65, color: '#22c55e' },
    { name: 'Retrasado', value: 20, color: '#f59e0b' },
    { name: 'Crítico', value: 15, color: '#ef4444' },
  ],
  kpis: {
    inProduction: 156,
    inTransit: 43,
    completed: 892,
    delayed: 12
  },
  pendingTasks: [
    {
      id: 1,
      title: 'Verificar retraso en envío #78910',
      priority: 'high',
      assignee: 'Logística - Pedro Rojas',
      dueDate: '2024-03-25',
      progress: 20
    },
    {
      id: 2,
      title: 'Confirmar recepción de orden #45678',
      priority: 'medium',
      assignee: 'Almacén - Sofía Ramírez',
      dueDate: '2024-03-26',
      progress: 50
    },
    {
      id: 3,
      title: 'Actualizar costos de transporte',
      priority: 'low',
      assignee: 'Administración - Carlos López',
      dueDate: '2024-03-27',
      progress: 80
    }
  ],
  efficiencyMetrics: {
    overall: 82,
    trend: 'up',
    previousPeriod: 78,
    bottlenecks: [
      { process: 'Pretinado', efficiency: 43, impact: 'high' },
      { process: 'Costura', efficiency: 57, impact: 'medium' },
    ]
  }
};


interface NotificationPreference {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: 'all' | 'high' | 'medium' | 'low';
}

interface VisualizationPreference {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export default function DashboardPage() {
  const {
    setBlocks,
    setShippingOrders,
    setOrders
  } = useProductionStore();

  const { setProcesses } = useProcessStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState('all');
  const [notifications, setNotifications] = useState(mockData.notifications);
  const [showSettings, setShowSettings] = useState(false);
  const [currentSettingsTab, setCurrentSettingsTab] = useState<'notifications' | 'visualization'>('notifications');


  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>([
    {
      id: 'prod_alerts',
      name: 'Alertas de Producción',
      description: 'Notificaciones sobre bloqueos y retrasos en producción',
      enabled: true,
      priority: 'high'
    },
    {
      id: 'transport_alerts',
      name: 'Alertas de Transporte',
      description: 'Notificaciones sobre envíos y entregas',
      enabled: true,
      priority: 'medium'
    },
    {
      id: 'system_updates',
      name: 'Actualizaciones del Sistema',
      description: 'Notificaciones sobre mantenimiento y actualizaciones',
      enabled: true,
      priority: 'low'
    }
  ]);

  const [visualizationPreferences, setVisualizationPreferences] = useState<VisualizationPreference[]>([
    {
      id: 'efficiency_charts',
      name: 'Gráficos de Eficiencia',
      description: 'Mostrar gráficos de eficiencia en el dashboard',
      enabled: true
    },
    {
      id: 'task_list',
      name: 'Lista de Tareas',
      description: 'Mostrar lista de tareas pendientes',
      enabled: true
    },
    {
      id: 'kpi_cards',
      name: 'Tarjetas KPI',
      description: 'Mostrar indicadores clave de rendimiento',
      enabled: true
    }
  ]);


  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const toggleNotificationPreference = (id: string) => {
    setNotificationPreferences(prefs =>
      prefs.map(pref =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const updateNotificationPriority = (id: string, priority: 'all' | 'high' | 'medium' | 'low') => {
    setNotificationPreferences(prefs =>
      prefs.map(pref =>
        pref.id === id ? { ...pref, priority } : pref
      )
    );
  };

  const toggleVisualizationPreference = (id: string) => {
    setVisualizationPreferences(prefs =>
      prefs.map(pref =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  useEffect(() => {
    setBlocks(mockBlocks);
  }, [setBlocks]);

  useEffect(() => {
    setOrders([]);
  }, []);

  useEffect(() => {
    setShippingOrders([]);
  }, []);

  useEffect(() => {
    setProcesses(processes)
  }, []);

  interface Empresa {
    pro_codemp: string;
    pro_nomemp: string;
    pro_numruc: string;
  }

  const [empresa, setEmpresa] = useState<Empresa | null>(null);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const data = await getEmpresaById("01");
        setEmpresa(data);
      } catch (error) {
        console.error("Error fetching empresa:", error);
      }
    };

    fetchEmpresa();
  }, []);



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
                  {empresa?.pro_nomemp}
                </p>
              </div>
            </div>


            <div className="flex items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="relative">
                    <Bell className="w-6 h-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Notificaciones</h4>
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                        Marcar todo como leído
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg ${notification.unread ? 'bg-muted' : ''
                            }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {notification.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.time}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeNotification(notification.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-6 h-6" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Configuración del Dashboard</DialogTitle>
                    <DialogDescription>
                      Personaliza tu experiencia en el dashboard
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="notifications" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
                      <TabsTrigger value="visualization">Visualización</TabsTrigger>
                    </TabsList>

                    <TabsContent value="notifications" className="space-y-4">
                      <div className="space-y-4">
                        {notificationPreferences.map((pref) => (
                          <div key={pref.id} className="flex items-start justify-between space-x-4 p-4 border rounded-lg">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{pref.name}</h4>
                                <Switch
                                  checked={pref.enabled}
                                  onCheckedChange={() => toggleNotificationPreference(pref.id)}
                                />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {pref.description}
                              </p>
                            </div>
                            <Select
                              value={pref.priority}
                              onValueChange={(value: any) => updateNotificationPriority(pref.id, value)}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="high">Alta</SelectItem>
                                <SelectItem value="medium">Media</SelectItem>
                                <SelectItem value="low">Baja</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="visualization" className="space-y-4">
                      <div className="space-y-4">
                        {visualizationPreferences.map((pref) => (
                          <div key={pref.id} className="flex items-start justify-between space-x-4 p-4 border rounded-lg">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{pref.name}</h4>
                                <Switch
                                  checked={pref.enabled}
                                  onCheckedChange={() => toggleVisualizationPreference(pref.id)}
                                />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {pref.description}
                              </p>
                            </div>
                          </div>
                        ))}

                        <div className="space-y-4">
                          <h4 className="font-medium">Personalización de Gráficos</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Tipo de Gráfico</label>
                              <Select defaultValue="line">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="line">Líneas</SelectItem>
                                  <SelectItem value="bar">Barras</SelectItem>
                                  <SelectItem value="pie">Circular</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Periodo</label>
                              <Select defaultValue="week">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="day">Día</SelectItem>
                                  <SelectItem value="week">Semana</SelectItem>
                                  <SelectItem value="month">Mes</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <DialogFooter>
                    <Button variant="outline">Restaurar Valores</Button>
                    <Button>Guardar Cambios</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Factory className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">En Proceso</p>
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
                            'bg-green-500 text-white'
                          }`}>
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="efficiency" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Tendencia Semanal</h3>
                    <Badge variant={mockData.efficiencyMetrics.trend === 'up' ? 'default' : 'destructive'}>
                      {mockData.efficiencyMetrics.trend === 'up' ? (
                        <ArrowUp className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDown className="w-4 h-4 mr-1" />
                      )}
                      {mockData.efficiencyMetrics.overall}% vs {mockData.efficiencyMetrics.previousPeriod}%
                    </Badge>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockData.weeklyEfficiency}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="efficiency" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Distribución de Procesos</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockData.processDistribution}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                        >
                          {mockData.processDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {mockData.processDistribution.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </div>
                        <span>{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 col-span-3">
                  <h3 className="text-lg font-semibold mb-6">Cuellos de Botella</h3>
                  <div className="space-y-6">
                    {mockData.efficiencyMetrics.bottlenecks.map((bottleneck, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{bottleneck.process}</span>
                          <Badge variant={bottleneck.impact === 'high' ? 'destructive' : 'default'}>
                            {bottleneck.impact}
                          </Badge>
                        </div>
                        <Progress value={bottleneck.efficiency} className="h-2" />
                        <p className="text-sm text-muted-foreground">
                          Eficiencia actual: {bottleneck.efficiency}%
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input className="pl-9" placeholder="Buscar tareas..." />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button>Nueva Tarea</Button>
              </div>

              <div className="space-y-4">
                {mockData.pendingTasks.map((task) => (
                  <Card key={task.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Asignado a: {task.assignee}
                          </p>
                        </div>
                        <Badge variant={
                          task.priority === 'high' ? 'destructive' :
                            task.priority === 'medium' ? 'default' :
                              'secondary'
                        }>
                          {task.priority}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progreso</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Vence: {task.dueDate}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}