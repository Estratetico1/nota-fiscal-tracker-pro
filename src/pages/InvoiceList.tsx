
import React, { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { InvoiceTable } from "@/components/dashboard/InvoiceTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, Upload, Filter, FileText, Download } from "lucide-react";

// Mock data - same as Dashboard for now
const invoices = [
  {
    id: "1",
    number: "NF-e 1234",
    client: "Farmácia São Paulo",
    issueDate: "15/04/2023",
    dueDate: "15/05/2023",
    value: 5678.90,
    status: "delivered" as const,
    paymentStatus: "paid" as const
  },
  {
    id: "2",
    number: "NF-e 1235",
    client: "Drogaria Modelo",
    issueDate: "16/04/2023",
    dueDate: "16/05/2023",
    value: 3421.50,
    status: "in-transit" as const,
    paymentStatus: "pending" as const
  },
  {
    id: "3",
    number: "NF-e 1236",
    client: "Farmácia Central",
    issueDate: "17/04/2023",
    dueDate: "17/04/2023",
    value: 1892.75,
    status: "issue" as const,
    paymentStatus: "overdue" as const
  },
  {
    id: "4",
    number: "NF-e 1237",
    client: "Distribuidora Saúde",
    issueDate: "18/04/2023",
    dueDate: "18/05/2023",
    value: 7634.20,
    status: "pending" as const,
    paymentStatus: "pending" as const
  },
  {
    id: "5",
    number: "NF-e 1238",
    client: "Farmácia Popular",
    issueDate: "19/04/2023",
    dueDate: "19/05/2023",
    value: 4567.30,
    status: "delivered" as const,
    paymentStatus: "paid" as const
  },
  {
    id: "6",
    number: "NF-e 1239",
    client: "Drogaria Bem Estar",
    issueDate: "20/04/2023",
    dueDate: "20/05/2023",
    value: 2987.45,
    status: "in-transit" as const,
    paymentStatus: "pending" as const
  },
];

const InvoiceList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleViewInvoice = (id: string) => {
    navigate(`/invoices/${id}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notas Fiscais</h1>
            <p className="text-gray-500 mt-1">Gerencie suas notas fiscais.</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate("/import")}>
              <Upload className="h-4 w-4 mr-2" />
              Importar Notas
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Pesquisar notas fiscais..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Select defaultValue="delivery-status">
                  <SelectTrigger>
                    <SelectValue placeholder="Status de Entrega" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in-transit">Em Trânsito</SelectItem>
                    <SelectItem value="delivered">Entregue</SelectItem>
                    <SelectItem value="issue">Com Ocorrência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select defaultValue="payment-status">
                  <SelectTrigger>
                    <SelectValue placeholder="Status de Pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="overdue">Vencido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-4 flex justify-end">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros Avançados
                </Button>
              </div>
            </div>

            <InvoiceTable 
              invoices={invoices}
              onViewInvoice={handleViewInvoice}
            />
            
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <div>
                Mostrando 1-{invoices.length} de {invoices.length} notas
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Próxima
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default InvoiceList;
