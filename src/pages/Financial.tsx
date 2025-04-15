
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
const mapSupabaseToInvoice = (item: any, source: 'contas_receber' | 'notas_fiscais'): Invoice => {
  // Determina o status com base na data de vencimento e quitação
  let status: InvoiceStatus = "pending";
  const currentDate = new Date();
  
  if (source === 'contas_receber') {
    const dueDate = item.data_vencimento ? new Date(item.data_vencimento) : null;
    
    if (item.data_quitacao) {
      status = "paid";
    } else if (dueDate && dueDate < currentDate) {
      status = "overdue";
    }
    
    return {
      id: String(item.sequencial_cr || `CR${Math.floor(Math.random() * 10000)}`),
      client: item.nome_fornecedor || "Fornecedor não especificado",
      invoiceNumber: item.num_nf ? `NF-e ${item.num_nf}` : "Sem número",
      value: Number(item.valor_parcela) || 0,
      dueDate: item.data_vencimento || new Date().toISOString().split('T')[0],
      status: status
    };
  } else {
    // Para notas_fiscais, calculamos o vencimento como emissão + 30 dias
    const issueDate = item.data_emissao ? new Date(item.data_emissao) : null;
    const dueDate = issueDate ? new Date(issueDate.getTime() + 30*24*60*60*1000) : null;
    
    if (dueDate && dueDate < currentDate) {
      status = "overdue";
    } else if (issueDate && currentDate.getTime() - issueDate.getTime() > 15*24*60*60*1000) {
      status = "paid";
    }
    
    return {
      id: String(item.id || `NF${Math.floor(Math.random() * 10000)}`),
      client: item.cliente || "Cliente não especificado",
      invoiceNumber: item.numero_nf ? `NF-e ${item.numero_nf}` : "Sem número",
      value: Number(item.valor_total) || 0,
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: status
    };
  }
};

const Financial = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | "">("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterDueDate, setFilterDueDate] = useState<string>("");
  const [invoicesData, setInvoicesData] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Busca os dados do Supabase
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      let allInvoices: Invoice[] = [];
      
      try {
        // Buscar dados de contas_receber
        const { data: contasReceberData, error: contasReceberError } = await supabase
          .from("contas_receber")
          .select("*");
        
        if (contasReceberError) {
          console.error("Erro ao buscar dados de contas a receber:", contasReceberError);
          toast.error("Erro ao carregar contas a receber", {
            description: "Não foi possível conectar ao banco de dados."
          });
        } else if (contasReceberData) {
          // Converter os dados para o formato de Invoice
          const mappedContasReceber = contasReceberData.map(item => mapSupabaseToInvoice(item, 'contas_receber'));
          allInvoices = [...allInvoices, ...mappedContasReceber];
          console.log("Dados de contas a receber carregados:", mappedContasReceber.length);
        }
        
        // Atualizar o estado com todos os dados combinados
        setInvoicesData(allInvoices);
        console.log("Total de faturas carregadas:", allInvoices.length);
      } catch (error) {
        console.error("Erro na requisição:", error);
        toast.error("Erro ao carregar dados", {
          description: "Ocorreu um erro inesperado."
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Filtragem de faturas
  const filteredInvoices = invoicesData.filter(invoice => {
    // Filtrar por status
    const statusFilter = selectedStatus === "" || invoice.status === selectedStatus;
    
    // Filtrar por termo de busca (cliente ou número da fatura)
    const searchFilter = searchTerm === "" || 
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por data de vencimento
    const dateFilter = filterDueDate === "" || invoice.dueDate === filterDueDate;
    
    return statusFilter && searchFilter && dateFilter;
  });
  
  // Calcula os valores de resumo
  const totalPending = filteredInvoices.filter(inv => inv.status === "pending").reduce((sum, inv) => sum + inv.value, 0);
  const pendingCount = filteredInvoices.filter(inv => inv.status === "pending").length;
  
  const totalPaid = filteredInvoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.value, 0);
  const paidCount = filteredInvoices.filter(inv => inv.status === "paid").length;
  
  const totalOverdue = filteredInvoices.filter(inv => inv.status === "overdue").reduce((sum, inv) => sum + inv.value, 0);
  const overdueCount = filteredInvoices.filter(inv => inv.status === "overdue").length;

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

  const handleApplyFilters = (status: InvoiceStatus | "", search: string, dueDate: string) => {
    setSelectedStatus(status);
    setSearchTerm(search);
    setFilterDueDate(dueDate);
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
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dueDate={filterDueDate}
          onDueDateChange={setFilterDueDate}
          onApplyFilters={handleApplyFilters}
        />
        
        {/* Invoices Table */}
        {isLoading ? (
          <div className="py-10 text-center">Carregando faturas...</div>
        ) : (
          <FinancialInvoiceTable
            invoices={filteredInvoices}
            onSendPaymentReminder={handleSendPaymentReminder}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Financial;
