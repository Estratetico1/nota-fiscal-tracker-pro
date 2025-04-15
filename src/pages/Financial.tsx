
import React, { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { FinancialSummary } from "@/components/financial/FinancialSummary";
import { FinancialFilters } from "@/components/financial/FinancialFilters";
import { FinancialInvoiceTable } from "@/components/financial/FinancialInvoiceTable";

// Define the Invoice type to match what FinancialInvoiceTable expects
type InvoiceStatus = "pending" | "paid" | "overdue";

interface Invoice {
  id: string;
  client: string;
  invoiceNumber: string;
  value: number;
  dueDate: string;
  status: InvoiceStatus;
}

const invoicesData: Invoice[] = [
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

const Financial = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | "">("");
  
  // Calculate summary values
  const totalPending = invoicesData.filter(inv => inv.status === "pending").reduce((sum, inv) => sum + inv.value, 0);
  const pendingCount = invoicesData.filter(inv => inv.status === "pending").length;
  
  const totalPaid = invoicesData.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.value, 0);
  const paidCount = invoicesData.filter(inv => inv.status === "paid").length;
  
  const totalOverdue = invoicesData.filter(inv => inv.status === "overdue").reduce((sum, inv) => sum + inv.value, 0);
  const overdueCount = invoicesData.filter(inv => inv.status === "overdue").length;

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
        <FinancialSummary
          totalPending={totalPending}
          pendingCount={pendingCount}
          totalPaid={totalPaid}
          paidCount={paidCount}
          totalOverdue={totalOverdue}
          overdueCount={overdueCount}
          onSendAllReminders={handleSendAllReminders}
        />
        
        {/* Filters and Search */}
        <FinancialFilters
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
        
        {/* Invoices Table */}
        <FinancialInvoiceTable
          invoices={filteredInvoices}
          onSendPaymentReminder={handleSendPaymentReminder}
        />
      </div>
    </MainLayout>
  );
};

export default Financial;
