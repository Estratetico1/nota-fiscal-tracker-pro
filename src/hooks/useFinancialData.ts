
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { fetchInvoiceData, filterInvoices, calculateSummaryMetrics } from "@/services/financialService";
import { Invoice, InvoiceStatus } from "@/types/financial";

export const useFinancialData = () => {
  const [invoicesData, setInvoicesData] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | "">("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterDueDate, setFilterDueDate] = useState<string>("");
  
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchInvoiceData();
        setInvoicesData(data);
        console.log("Total de faturas carregadas:", data.length);
      } catch (error) {
        console.error("Erro na requisição:", error);
        toast.error("Erro ao carregar dados", {
          description: "Ocorreu um erro inesperado."
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  // Filter invoices based on criteria
  const filteredInvoices = filterInvoices(invoicesData, selectedStatus, searchTerm, filterDueDate);
  
  // Calculate summary metrics
  const summaryMetrics = calculateSummaryMetrics(filteredInvoices);
  
  // Send payment reminder
  const handleSendPaymentReminder = (invoiceId: string) => {
    const invoice = invoicesData.find(inv => inv.id === invoiceId);
    toast.success(`Lembrete de pagamento enviado para ${invoice?.client}`, {
      description: `Referente à fatura ${invoice?.invoiceNumber}`,
      duration: 5000,
    });
  };

  // Send all reminders
  const handleSendAllReminders = () => {
    const overdueInvoices = invoicesData.filter(inv => inv.status === "overdue");
    toast.success(`Lembretes enviados para ${overdueInvoices.length} clientes inadimplentes`, {
      description: "Todos os clientes com faturas vencidas foram notificados.",
      duration: 5000,
    });
  };

  // Apply filters
  const handleApplyFilters = (status: InvoiceStatus | "", search: string, dueDate: string) => {
    setSelectedStatus(status);
    setSearchTerm(search);
    setFilterDueDate(dueDate);
  };
  
  return {
    isLoading,
    filteredInvoices,
    summaryMetrics,
    selectedStatus,
    setSelectedStatus,
    searchTerm,
    setSearchTerm,
    filterDueDate,
    setFilterDueDate,
    handleSendPaymentReminder,
    handleSendAllReminders,
    handleApplyFilters
  };
};
