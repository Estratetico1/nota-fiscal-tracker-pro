
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { FinancialSummary } from "@/components/financial/FinancialSummary";
import { FinancialFilters } from "@/components/financial/FinancialFilters";
import { FinancialInvoiceTable } from "@/components/financial/FinancialInvoiceTable";
import { supabase } from "@/integrations/supabase/client";

// Define o tipo InvoiceStatus para ser usado em todo o componente
export type InvoiceStatus = "pending" | "paid" | "overdue";

interface Invoice {
  id: string;
  client: string;
  invoiceNumber: string;
  value: number;
  dueDate: string;
  status: InvoiceStatus;
}

// Função para mapear os dados do Supabase para o formato de Invoice
const mapSupabaseToInvoice = (item: any): Invoice => {
  // Determina o status com base na data de vencimento e quitação
  let status: InvoiceStatus = "pending";
  const currentDate = new Date();
  const dueDate = item.data_vencimento ? new Date(item.data_vencimento) : null;
  
  if (item.data_quitacao) {
    status = "paid";
  } else if (dueDate && dueDate < currentDate) {
    status = "overdue";
  }
  
  return {
    id: String(item.sequencial_cr || item.id || `INV${Math.floor(Math.random() * 10000)}`),
    client: item.nome_fornecedor || "Cliente não especificado",
    invoiceNumber: item.num_documento || item.num_nf ? `NF-e ${item.num_nf || item.num_documento}` : "Sem número",
    value: Number(item.valor_parcela) || 0,
    dueDate: item.data_vencimento || new Date().toISOString().split('T')[0],
    status: status
  };
};

const Financial = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | "">("");
  const [invoicesData, setInvoicesData] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Busca os dados do Supabase
  useEffect(() => {
    async function fetchInvoices() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("contas_receber")
          .select("*");
        
        if (error) {
          console.error("Erro ao buscar dados:", error);
          toast.error("Erro ao carregar faturas", {
            description: "Não foi possível conectar ao banco de dados."
          });
        } else {
          // Converte os dados para o formato de Invoice
          const mappedInvoices = data.map(mapSupabaseToInvoice);
          setInvoicesData(mappedInvoices);
          console.log("Dados carregados:", mappedInvoices);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchInvoices();
  }, []);
  
  // Calcula os valores de resumo
  const totalPending = invoicesData.filter(inv => inv.status === "pending").reduce((sum, inv) => sum + inv.value, 0);
  const pendingCount = invoicesData.filter(inv => inv.status === "pending").length;
  
  const totalPaid = invoicesData.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.value, 0);
  const paidCount = invoicesData.filter(inv => inv.status === "paid").length;
  
  const totalOverdue = invoicesData.filter(inv => inv.status === "overdue").reduce((sum, inv) => sum + inv.value, 0);
  const overdueCount = invoicesData.filter(inv => inv.status === "overdue").length;

  // Filtra as faturas com base no status selecionado
  const filteredInvoices = selectedStatus 
    ? invoicesData.filter(invoice => invoice.status === selectedStatus)
    : invoicesData;

  const handleSendPaymentReminder = (invoiceId: string) => {
    // Em uma aplicação real, isso enviaria uma solicitação de API para enviar um e-mail
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
