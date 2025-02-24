"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bell, Settings, Factory, Truck, CheckCircle, AlertTriangle } from "lucide-react";

import ProductionPage from "./production/page";
import ConfigPage from "./config/page";
import SuppliersPage from "./suppliers/page";
import TransportPage from "./transport/page";
import DashboardPage from "./dashboard/page";
import LoginPage from "./auth/login/page";

const mockData = {
  efficiency: [
    { name: 'Corte', value: 85 },
    { name: 'Confección', value: 92 },
    { name: 'Acabado', value: 78 },
    { name: 'Empaque', value: 95 },
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

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <LoginPage />
    </div>
  );
}