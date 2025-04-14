
import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { InvoiceTable } from "@/components/dashboard/InvoiceTable";
import { 
  FileText, 
  TruckIcon, 
  DollarSign, 
  AlertTriangle,
  ArrowUpRight,
  BarChart2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

// Mock data
const recentInvoices = [
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
  }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleViewInvoice = (id: string) => {
    navigate(`/invoices/${id}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1">Visão geral do sistema de rastreamento de notas fiscais.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatusCard
            title="Total de Notas Fiscais"
            value="1,234"
            icon={<FileText className="h-5 w-5" />}
            trend={{ value: 12, isPositive: true }}
            variant="teal"
          />
          <StatusCard
            title="Entregas em Andamento"
            value="42"
            icon={<TruckIcon className="h-5 w-5" />}
            trend={{ value: 8, isPositive: true }}
            variant="orange"
          />
          <StatusCard
            title="Valor a Receber"
            value="R$ 458.230,45"
            icon={<DollarSign className="h-5 w-5" />}
            trend={{ value: 5, isPositive: true }}
            variant="teal"
          />
          <StatusCard
            title="Notas com Atraso"
            value="18"
            icon={<AlertTriangle className="h-5 w-5" />}
            trend={{ value: 3, isPositive: false }}
            variant="gray"
          />
        </div>

        <Tabs defaultValue="recent">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="recent">Notas Recentes</TabsTrigger>
              <TabsTrigger value="delivery">Entregas Pendentes</TabsTrigger>
              <TabsTrigger value="payment">Pagamentos</TabsTrigger>
            </TabsList>
            <div className="flex items-center text-sm text-teal-600 hover:text-teal-800 cursor-pointer">
              <span>Ver todos</span>
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </div>
          </div>

          <TabsContent value="recent" className="mt-4">
            <InvoiceTable 
              invoices={recentInvoices} 
              onViewInvoice={handleViewInvoice}
            />
          </TabsContent>
          <TabsContent value="delivery" className="mt-4">
            <InvoiceTable 
              invoices={recentInvoices.filter(i => i.status !== 'delivered')} 
              onViewInvoice={handleViewInvoice}
            />
          </TabsContent>
          <TabsContent value="payment" className="mt-4">
            <InvoiceTable 
              invoices={recentInvoices.filter(i => i.paymentStatus !== 'paid')} 
              onViewInvoice={handleViewInvoice}
            />
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Distribuição de Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-gray-400">
                <BarChart2 className="h-12 w-12" />
                <span className="ml-2">Gráfico de distribuição</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Entregas por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-gray-400">
                <BarChart2 className="h-12 w-12" />
                <span className="ml-2">Gráfico de entregas</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
