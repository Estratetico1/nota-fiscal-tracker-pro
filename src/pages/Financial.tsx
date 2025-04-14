
import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/format";
import { Search, CalendarIcon, ArrowUpDown, Eye, Banknote, AlertCircle, Download, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
  // Calculate summary values
  const totalPending = invoicesData.filter(inv => inv.status === "pending").reduce((sum, inv) => sum + inv.value, 0);
  const pendingCount = invoicesData.filter(inv => inv.status === "pending").length;
  
  const totalPaid = invoicesData.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.value, 0);
  const paidCount = invoicesData.filter(inv => inv.status === "paid").length;
  
  const totalOverdue = invoicesData.filter(inv => inv.status === "overdue").reduce((sum, inv) => sum + inv.value, 0);
  const overdueCount = invoicesData.filter(inv => inv.status === "overdue").length;

  const [selectedStatus, setSelectedStatus] = React.useState("");

  // Filter invoices based on the selected status
  const filteredInvoices = selectedStatus 
    ? invoicesData.filter(invoice => invoice.status === selectedStatus)
    : invoicesData;

  const handleSendPaymentReminder = (invoiceId: string) => {
    // In a real application, this would send an API request to send an email
    const invoice = invoicesData.find(inv => inv.id === invoiceId);
    toast.success(`Lembrete de pagamento enviado para ${invoice?.client}`, {
      description: `Referente à fatura ${invoice?.invoiceNumber}`,
      duration: 5000,
    });
  };

  const handleSendAllReminders = () => {
    const overdueInvoices = invoicesData.filter(inv => inv.status === "overdue");
    toast.success(`Lembretes enviados para ${overdueInvoices.length} clientes inadimplentes`, {
      description: "Todos os clientes com faturas vencidas foram notificados.",
      duration: 5000,
    });
  };

  const handleGoToConfig = () => {
    navigate("/settings");
  };

  const handleGoToRouting = () => {
    navigate("/invoice-routing");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleGoToConfig}>
              Configurações
            </Button>
            <Button variant="outline" onClick={handleGoToRouting}>
              Roteirização
            </Button>
          </div>
        </div>
        
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
            action={
              <Button size="sm" variant="destructive" className="ml-auto" onClick={handleSendAllReminders}>
                <Mail className="h-4 w-4 mr-1" />
                Enviar Cobrança
              </Button>
            }
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
                <select 
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
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
                  {filteredInvoices.map((invoice) => (
                    <TableRow 
                      key={invoice.id}
                      className={invoice.status === "overdue" ? "bg-red-50" : ""} // Highlight overdue rows
                    >
                      <TableCell className="font-medium">{invoice.client}</TableCell>
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{formatCurrency(invoice.value)}</TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {invoice.status === "overdue" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSendPaymentReminder(invoice.id)}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
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
                              {invoice.status === "overdue" && (
                                <DropdownMenuItem onClick={() => handleSendPaymentReminder(invoice.id)}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Enviar cobrança
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Baixar boleto
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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
