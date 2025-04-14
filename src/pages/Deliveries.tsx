
import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/format";
import { Search, Truck, CheckCircle, AlertTriangle, MapPin, Clock, Eye, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const deliveriesData = [
  {
    id: "DEL001",
    trackingCode: "TRK12345",
    client: "Farmácia Santa Maria",
    origin: "São Paulo, SP",
    destination: "Campinas, SP",
    status: "in_progress",
    lastUpdate: "2025-04-13",
    lastLocation: "Jundiaí, SP"
  },
  {
    id: "DEL002",
    trackingCode: "TRK12346",
    client: "Drogaria São Paulo",
    origin: "São Paulo, SP",
    destination: "Ribeirão Preto, SP",
    status: "completed",
    lastUpdate: "2025-04-12",
    lastLocation: "Ribeirão Preto, SP"
  },
  {
    id: "DEL003",
    trackingCode: "TRK12347",
    client: "Farmácia Popular",
    origin: "São Paulo, SP",
    destination: "São José dos Campos, SP",
    status: "issue",
    lastUpdate: "2025-04-11",
    lastLocation: "Taubaté, SP"
  },
  {
    id: "DEL004",
    trackingCode: "TRK12348",
    client: "Drogasil",
    origin: "São Paulo, SP",
    destination: "Sorocaba, SP",
    status: "in_progress",
    lastUpdate: "2025-04-13",
    lastLocation: "São Roque, SP"
  },
  {
    id: "DEL005",
    trackingCode: "TRK12349",
    client: "Pague Menos",
    origin: "São Paulo, SP",
    destination: "Santos, SP",
    status: "completed",
    lastUpdate: "2025-04-10",
    lastLocation: "Santos, SP"
  },
  {
    id: "DEL006",
    trackingCode: "TRK12350",
    client: "Droga Raia",
    origin: "São Paulo, SP",
    destination: "Bauru, SP",
    status: "issue",
    lastUpdate: "2025-04-09",
    lastLocation: "Botucatu, SP"
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "in_progress":
      return <Badge className="bg-blue-500">Em Andamento</Badge>;
    case "completed":
      return <Badge className="bg-green-500">Concluída</Badge>;
    case "issue":
      return <Badge className="bg-red-500">Ocorrência</Badge>;
    default:
      return <Badge>Desconhecido</Badge>;
  }
};

const Deliveries = () => {
  // Calculate summary values
  const inProgressCount = deliveriesData.filter(del => del.status === "in_progress").length;
  const completedCount = deliveriesData.filter(del => del.status === "completed").length;
  const issueCount = deliveriesData.filter(del => del.status === "issue").length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Rastreamento de Entregas</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatusCard 
            title="Em Andamento" 
            value={inProgressCount.toString()}
            icon={<Truck className="h-6 w-6" />}
            variant="blue"
          />
          <StatusCard 
            title="Concluídas" 
            value={completedCount.toString()}
            icon={<CheckCircle className="h-6 w-6" />}
            variant="teal"
          />
          <StatusCard 
            title="Ocorrências" 
            value={issueCount.toString()}
            icon={<AlertTriangle className="h-6 w-6" />}
            variant="red"
          />
        </div>
        
        {/* Filters and Search */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Input type="text" placeholder="Buscar cliente ou código..." className="pl-9" />
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              </div>
              <div>
                <Input type="date" placeholder="Data da entrega" className="w-full" />
              </div>
              <div>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                  <option value="">Todos os status</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                  <option value="issue">Ocorrência</option>
                </select>
              </div>
              <div>
                <Button className="w-full">Filtrar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Deliveries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Entregas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Origem → Destino</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Última Atualização</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveriesData.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.trackingCode}</TableCell>
                      <TableCell>{delivery.client}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{delivery.origin}</span>
                          <span className="mx-1">→</span>
                          <span>{delivery.destination}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span>{formatDate(delivery.lastUpdate)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{delivery.lastLocation}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Ações
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MapPin className="mr-2 h-4 w-4" />
                              Ver rota
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Atualizar status
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Deliveries;
