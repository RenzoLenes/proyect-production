"use client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Brush } from 'recharts';
import { Bell, Settings, Factory, Truck, CheckCircle, AlertTriangle, Menu, Filter, Search, Clock, ArrowUp, ArrowDown, X } from "lucide-react";
import SideBar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { useProductionStore } from "@/lib/store/productionStore";
import { processes } from "@/types/process";
import { useProcessStore } from "@/lib/store/processStore";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEmpresaById } from "@/actions/empresa/crud-empresa";
import { MovimientoProcesoResultado } from '../../interfaces/movproceso.interface';
import { obtenerMovimientosPendientes } from '../../actions/procesoc/crud-movprocesoc';
import { Empresa } from "@/interfaces/empresas.interface";
import { TipoConfeccionSelector } from "@/components/config/ConfeccionSelector";
import { useConfigStore } from "@/lib/store/configStore";
import { Folder } from "@/interfaces/folder.interface";
import { Calidad } from "@/interfaces/calidad.interface";
import { TipoCorte } from "@/interfaces/tipocorte.interface";
import { getFolderByTipo } from "@/actions/folder/crud-folder";
import { getCalidadByTipo } from "@/actions/calidad/crud-calidad";
import { getAllTiposCorte } from "@/actions/tipo-corte/crud-tipocorte";
import { RptPrendasProceso } from "@/interfaces/reportes/rpt-prendas-proceso";
import { getPrendasPorProceso, getPrendasPorProcesoParams } from "@/actions/procesos/crud-proceso";

const mockData = {
  notifications: [
    { id: 1, title: "Retraso en entrega", description: "El envío #78910 ha superado el tiempo estimado", type: "alert", time: "Hace 10 minutos", unread: true },
    { id: 2, title: "Nueva orden programada", description: "Se ha agendado el envío de la orden #45678 para mañana", type: "info", time: "Hace 30 minutos", unread: true },
    { id: 3, title: "Actualización de costos", description: "Se han actualizado las tarifas de transporte externo", type: "info", time: "Hace 2 horas", unread: false }
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
    { id: 1, title: 'Verificar retraso en envío #78910', priority: 'high', assignee: 'Logística - Pedro Rojas', dueDate: '2024-03-25', progress: 20 },
    { id: 2, title: 'Confirmar recepción de orden #45678', priority: 'medium', assignee: 'Almacén - Sofía Ramírez', dueDate: '2024-03-26', progress: 50 },
    { id: 3, title: 'Actualizar costos de transporte', priority: 'low', assignee: 'Administración - Carlos López', dueDate: '2024-03-27', progress: 80 }
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
  const { setBlocks, setShippingOrders, setOrders } = useProductionStore();
  const { setProcesses } = useProcessStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockData.notifications);
  const [showSettings, setShowSettings] = useState(false);
  const { tipoConfeccion, initializeTipoConfeccion } = useConfigStore();
  const [currentSettingsTab, setCurrentSettingsTab] = useState<'notifications' | 'visualization'>('notifications');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [calidades, setCalidades] = useState<Calidad[]>([]);
  const [tiposCorte, setTiposCorte] = useState<TipoCorte[]>([]);
  const [prendasPorProceso, setPrendasPorProceso] = useState<RptPrendasProceso[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterParams, setFilterParams] = useState({
    pro_codfol: "",
    pro_codcal: "",
    pro_codtco: "",
    fecha_inicio: new Date(),
    fecha_fin: new Date(new Date().setDate(new Date().getDate() + 7)) // Default to next 7 days
  });

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

  useEffect(() => {
    const fetchFilterOptions = async () => {
      if (tipoConfeccion) {
        try {
          const foldersData = await getFolderByTipo(tipoConfeccion);
          setFolders(foldersData);
          const calidadesData = await getCalidadByTipo({ pro_codtic: tipoConfeccion });
          setCalidades(calidadesData);
          const tiposCorteData = await getAllTiposCorte(tipoConfeccion);
          setTiposCorte(tiposCorteData);
        } catch (error) {
          console.error("Error fetching options:", error);
        }
      }
    };
    fetchFilterOptions();
  }, [tipoConfeccion]);

  useEffect(() => {
    initializeTipoConfeccion('001');  // O el valor por defecto que prefieras
  }, [initializeTipoConfeccion]);

  const fetchPrendasPorProceso = async (params: typeof filterParams) => {
    try {
      setIsLoading(true);
      const queryParams: getPrendasPorProcesoParams = {
        pro_codtic: tipoConfeccion || '',
        pro_codfol: params.pro_codfol,
        pro_codcal: params.pro_codcal || '',
        pro_codtco: params.pro_codtco || '',
        fecha_inicio: params.fecha_inicio,
        fecha_fin: params.fecha_fin
      };
      const data = await getPrendasPorProceso(queryParams);
      setPrendasPorProceso(data);
    } catch (error) {
      console.error("Error fetching prendas por proceso:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = async (field: string, value: any) => {
    const newParams = {
      ...filterParams,
      [field]: value
    };
    setFilterParams(newParams);
    if (newParams.pro_codfol && tipoConfeccion) {
      await fetchPrendasPorProceso(newParams);
    }
  };

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
      prefs.map(pref => pref.id === id ? { ...pref, enabled: !pref.enabled } : pref)
    );
  };

  const updateNotificationPriority = (id: string, priority: 'all' | 'high' | 'medium' | 'low') => {
    setNotificationPreferences(prefs =>
      prefs.map(pref => pref.id === id ? { ...pref, priority } : pref)
    );
  };

  const toggleVisualizationPreference = (id: string) => {
    setVisualizationPreferences(prefs =>
      prefs.map(pref => pref.id === id ? { ...pref, enabled: !pref.enabled } : pref)
    );
  };

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

  useEffect(() => {
    if (tipoConfeccion && folders.length > 0) {
      const initialParams = {
        ...filterParams,
        pro_codfol: '.',
        pro_codcal: '.',
        pro_codtco: '.'
      };

      setFilterParams(initialParams);
      fetchPrendasPorProceso(initialParams);
    }
  }, [tipoConfeccion, folders]);

  return (
    <div className="flex flex-col min-h-screen">
      <SideBar isMobileOpen={isMobileOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-8 lg:ml-64 transition-all duration-300 ease-in-out">
        {/* Top Bar */}
        <div className="bg-background border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-accent">
                  <Menu className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {empresa?.pro_nomemp}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <TipoConfeccionSelector />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
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
                            className={`p-3 rounded-lg ${notification.unread ? 'bg-muted' : ''}`}
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
                    <Button variant="outline" size="icon">
                      <Settings className="h-5 w-5" />
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
                          {/* Personalización de Gráficos */}
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
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-2 sm:px-4 pt-4 sm:pt-8 max-w-full">
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
                <h3 className="text-lg font-semibold mb-4">Prendas según Proceso</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Folder</label>
                      <Select
                        value={filterParams.pro_codfol}
                        onValueChange={(value) => handleFilterChange('pro_codfol', value)}
                      >
                        <SelectTrigger>
                          <SelectValue defaultValue="." placeholder="Seleccionar Folder" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=".">Todos</SelectItem>
                          {folders.map((folder) => (
                            <SelectItem key={folder.pro_codfol} value={folder.pro_codfol}>
                              {folder.pro_nomfol}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Calidad</label>
                      <Select
                        value={filterParams.pro_codcal}
                        onValueChange={(value) => handleFilterChange('pro_codcal', value)}
                      >
                        <SelectTrigger>
                          <SelectValue defaultValue="." placeholder="Seleccionar Calidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=".">Todas</SelectItem>
                          {calidades.map((calidad) => (
                            <SelectItem key={calidad.pro_codcal} value={calidad.pro_codcal}>
                              {calidad.pro_nomcal}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Tipo de Corte</label>
                      <Select
                        value={filterParams.pro_codtco}
                        onValueChange={(value) => handleFilterChange('pro_codtco', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=".">Todos</SelectItem>
                          {tiposCorte.map((tipo) => (
                            <SelectItem key={tipo.pro_codtco} value={tipo.pro_codtco}>
                              {tipo.pro_nomtco}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Fecha Inicio</label>
                      <input
                        type="date"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={filterParams.fecha_inicio.toISOString().split('T')[0]}
                        onChange={(e) => handleFilterChange('fecha_inicio', new Date(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Fecha Fin</label>
                      <input
                        type="date"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={filterParams.fecha_fin.toISOString().split('T')[0]}
                        onChange={(e) => handleFilterChange('fecha_fin', new Date(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Button
                      onClick={() => fetchPrendasPorProceso(filterParams)}
                      disabled={!filterParams.pro_codfol || !tipoConfeccion || isLoading}
                    >
                      {isLoading ? "Cargando..." : "Aplicar Filtros"}
                    </Button>
                  </div>
                  <div className="h-72 md:h-100 lg:h-96">
                    {isLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <p>Cargando datos...</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={prendasPorProceso.length ? prendasPorProceso.map(item => ({
                            name: item.pro_nompro,
                            value: item.total
                          })) : []}
                          margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 8, fill: 'rgba(0, 0, 0, 0.7)' }}
                            angle={-45}
                            textAnchor="end"
                            height={70}
                            interval={0}
                            tickMargin={10}
                          />
                          <YAxis
                            width={45}
                            tickFormatter={(value) => new Intl.NumberFormat('es-ES', {
                              notation: 'compact',
                              compactDisplay: 'short'
                            }).format(value)}
                            domain={['auto', 'auto']}
                            allowDataOverflow={false}
                          />
                          <Tooltip
                            formatter={(value) => [`${new Intl.NumberFormat('es-ES').format(value as number)}`, 'Cantidad']}
                            labelFormatter={(label) => `Proceso: ${label}`}
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              padding: '8px',
                              fontSize: '12px'
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ r: 3, strokeWidth: 1, fill: 'white' }}
                            activeDot={{ r: 5, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
                            animationDuration={1000}
                            animationEasing="ease-in-out"
                          />
                          <Brush
                            dataKey="name"
                            height={20}
                            stroke="hsl(var(--primary))"
                            startIndex={0}
                            endIndex={Math.min(prendasPorProceso.length > 5 ? 4 : prendasPorProceso.length - 1, prendasPorProceso.length - 1)}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
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
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input className="pl-9" placeholder="Buscar tareas..." />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button>Nueva Tarea</Button>
                </div>
              </div>
              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="space-y-4 pb-6">
                  {mockData.pendingTasks.map((task) => (
                    <Card key={task.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">Asignado a: {task.assignee}</p>
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
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}