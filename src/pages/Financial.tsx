
import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/format";
import { Search, CalendarIcon, ArrowUpDown, Eye, Banknote, AlertCircle, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const invoicesData = [
  {
    id: "INV001",
    client: "Farmácia Santa Maria",
    invoiceNumber: "NF-e 12345",
    value: 2850.75,
    dueDate: "2025-04-25",
    status: "pending",
  },
  {
    id: "INV002",
    client: "Drogaria São Paulo",
    invoiceNumber: "NF-e 12346",
    value: 1250.50,
    dueDate: "2025-04-18",
    status: "paid",
  },
  {
    id: "INV003",
    client: "Farmácia Popular",
    invoiceNumber: "NF-e 12347",
    value: 3620.30,
    dueDate: "2025-04-10",
    status: "overdue",
  },
  {
    id: "INV004",
    client: "Drogasil",
    invoiceNumber: "NF-e 12348",
    value: 1890.25,
    dueDate: "2025-04-30",
    status: "pending",
  },
  {
    id: "INV005",
    client: "Pague Menos",
    invoiceNumber: "NF-e 12349",
    value: 5240.00,
    dueDate: "2025-04-12",
    status: "overdue",
  },
  {
    id: "INV006",
    client: "Droga Raia",
    invoiceNumber: "NF-e 12350",
    value: 3780.45,
    dueDate: "2025-04-22",
    status: "paid",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge className="bg-yellow-500">A Receber</Badge>;
    case "paid":
      return <Badge className="bg-green-500">Recebido</Badge>;
    case "overdue":
      return <Badge className="bg-red-500">Inadimplente</Badge>;
    default:
      return <Badge>Desconhecido</Badge>;
  }
};

const Financial = () => {
  // Calculate summary values
  const totalPending = invoicesData.filter(inv => inv.status === "pending").reduce((sum, inv) => sum + inv.value, 0);
  const pendingCount = invoicesData.filter(inv => inv.status === "pending").length;
  
  const totalPaid = invoicesData.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.value, 0);
  const paidCount = invoicesData.filter(inv => inv.status === "paid").length;
  
  const totalOverdue = invoicesData.filter(inv => inv.status === "overdue").reduce((sum, inv) => sum + inv.value, 0);
  const overdueCount = invoicesData.filter(inv => inv.status === "overdue").length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Financeiro</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatusCard 
            title="A Receber" 
            value={formatCurrency(totalPending)}
            icon={<Banknote className="h-6 w-6" />}
            variant="yellow"
            trend={{ value: 15, isPositive: true }}
          />
          <StatusCard 
            title="Recebidos" 
            value={formatCurrency(totalPaid)}
            icon={<Banknote className="h-6 w-6" />}
            variant="teal"
            trend={{ value: 8, isPositive: true }}
          />
          <StatusCard 
            title="Inadimplentes" 
            value={formatCurrency(totalOverdue)}
            icon={<AlertCircle className="h-6 w-6" />}
            variant="red"
            trend={{ value: 3, isPositive: false }}
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
                <Input type="text" placeholder="Buscar cliente..." className="pl-9" />
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              </div>
              <div>
                <Input type="date" placeholder="Data de vencimento" className="w-full" />
              </div>
              <div>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                  <option value="">Todos os status</option>
                  <option value="pending">A Receber</option>
                  <option value="paid">Recebido</option>
                  <option value="overdue">Inadimplente</option>
                </select>
              </div>
              <div>
                <Button className="w-full">Filtrar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Faturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Nº da Fatura</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoicesData.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.client}</TableCell>
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{formatCurrency(invoice.value)}</TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
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
                              <Banknote className="mr-2 h-4 w-4" />
                              {invoice.status === "paid" ? "Estornar" : "Marcar como pago"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Baixar boleto
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

export default Financial;
