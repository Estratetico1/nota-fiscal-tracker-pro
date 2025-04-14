
import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { Map, Truck, Route, MapPin, Calendar, Search, FileText, Package } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Mock data for invoices that need routing
const invoicesForRouting = [
  {
    id: "INV001",
    client: "Farmácia Santa Maria",
    invoiceNumber: "NF-e 12345",
    address: "Av. Paulista, 1000, São Paulo - SP",
    value: 2850.75,
    weight: 15.5,
    volume: 0.25,
    isSelected: false
  },
  {
    id: "INV004",
    client: "Drogasil",
    invoiceNumber: "NF-e 12348",
    address: "Rua Augusta, 500, São Paulo - SP",
    value: 1890.25,
    weight: 8.2,
    volume: 0.15,
    isSelected: false
  },
  {
    id: "INV007",
    client: "Farmácia São João",
    invoiceNumber: "NF-e 12351",
    address: "Rua da Consolação, 250, São Paulo - SP",
    value: 3250.00,
    weight: 12.8,
    volume: 0.22,
    isSelected: false
  },
  {
    id: "INV008",
    client: "Drogaria Pacheco",
    invoiceNumber: "NF-e 12352",
    address: "Av. Faria Lima, 1500, São Paulo - SP",
    value: 4150.50,
    weight: 18.3,
    volume: 0.31,
    isSelected: false
  },
  {
    id: "INV009",
    client: "Drogarias Bifarma",
    invoiceNumber: "NF-e 12353",
    address: "Av. Rebouças, 750, São Paulo - SP",
    value: 2730.25,
    weight: 10.1,
    volume: 0.18,
    isSelected: false
  }
];

// Mock data for vehicles
const vehicles = [
  { id: 1, name: "Van MB Sprinter", capacity: 1200, volume: 10.5 },
  { id: 2, name: "Caminhão VW 8.160", capacity: 3500, volume: 30.5 },
  { id: 3, name: "Furgão Fiat Ducato", capacity: 1500, volume: 13.0 }
];

const InvoiceRouting = () => {
  const [selectedInvoices, setSelectedInvoices] = React.useState<string[]>([]);
  const [selectedVehicle, setSelectedVehicle] = React.useState<number | null>(null);
  const [routingDate, setRoutingDate] = React.useState("");

  const handleToggleInvoice = (id: string) => {
    setSelectedInvoices(prev => {
      if (prev.includes(id)) {
        return prev.filter(invId => invId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === invoicesForRouting.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(invoicesForRouting.map(inv => inv.id));
    }
  };

  const handleCreateRoute = () => {
    if (selectedInvoices.length === 0) {
      toast.error("Selecione pelo menos uma nota fiscal");
      return;
    }

    if (!selectedVehicle) {
      toast.error("Selecione um veículo para a rota");
      return;
    }

    if (!routingDate) {
      toast.error("Selecione uma data para a rota");
      return;
    }

    // In a real app, this would send the data to create a route
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    
    toast.success("Rota criada com sucesso!", {
      description: `${selectedInvoices.length} notas fiscais adicionadas para entrega com ${vehicle?.name} em ${formatDate(routingDate)}`
    });
  };
  
  const calculateTotals = () => {
    const selected = invoicesForRouting.filter(inv => selectedInvoices.includes(inv.id));
    
    const totalWeight = selected.reduce((sum, inv) => sum + inv.weight, 0);
    const totalVolume = selected.reduce((sum, inv) => sum + inv.volume, 0);
    const totalValue = selected.reduce((sum, inv) => sum + inv.value, 0);
    
    return { totalWeight, totalVolume, totalValue };
  };
  
  const { totalWeight, totalVolume, totalValue } = calculateTotals();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Roteirização de Entregas</h1>
          <Button onClick={handleCreateRoute}>
            <Route className="mr-2 h-4 w-4" />
            Criar Rota
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Route Configuration */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Configuração da Rota</CardTitle>
              <CardDescription>
                Defina veículo e data para a rota
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle">Veículo</Label>
                <select 
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={selectedVehicle || ""}
                  onChange={(e) => setSelectedVehicle(Number(e.target.value))}
                >
                  <option value="">Selecione um veículo</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} - {vehicle.capacity}kg / {vehicle.volume}m³
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data da Entrega</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={routingDate} 
                  onChange={(e) => setRoutingDate(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Resumo da Carga</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total de NFs:</span>
                    <Badge variant="outline">{selectedInvoices.length} de {invoicesForRouting.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Peso Total:</span>
                    <Badge variant="outline">{totalWeight.toFixed(2)} kg</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Volume Total:</span>
                    <Badge variant="outline">{totalVolume.toFixed(2)} m³</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor Total:</span>
                    <Badge variant="outline">{formatCurrency(totalValue)}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Selection */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Notas Fiscais Disponíveis</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSelectAll}
                  >
                    {selectedInvoices.length === invoicesForRouting.length ? "Desmarcar Todos" : "Selecionar Todos"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Nota Fiscal</TableHead>
                        <TableHead>Endereço</TableHead>
                        <TableHead>Peso</TableHead>
                        <TableHead>Volume</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoicesForRouting.map((invoice) => (
                        <TableRow 
                          key={invoice.id} 
                          className={selectedInvoices.includes(invoice.id) ? "bg-teal-50" : ""}
                        >
                          <TableCell>
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                              checked={selectedInvoices.includes(invoice.id)}
                              onChange={() => handleToggleInvoice(invoice.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{invoice.client}</TableCell>
                          <TableCell>{invoice.invoiceNumber}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                              <span className="text-sm">{invoice.address}</span>
                            </div>
                          </TableCell>
                          <TableCell>{invoice.weight} kg</TableCell>
                          <TableCell>{invoice.volume} m³</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InvoiceRouting;
