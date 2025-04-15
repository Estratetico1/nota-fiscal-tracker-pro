
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
    client: item.nome_fornecedor || item.cliente || "Cliente não especificado",
    invoiceNumber: item.num_nf ? `NF-e ${item.num_nf}` : item.numero_nf ? `NF-e ${item.numero_nf}` : "Sem número",
    value: Number(item.valor_parcela || item.valor_total) || 0,
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
          const mappedContasReceber = contasReceberData.map(mapSupabaseToInvoice);
          allInvoices = [...allInvoices, ...mappedContasReceber];
          console.log("Dados de contas a receber carregados:", mappedContasReceber.length);
        }

        // Buscar dados de notas_fiscais
        const { data: notasFiscaisData, error: notasFiscaisError } = await supabase
          .from("notas_fiscais")
          .select("*");
        
        if (notasFiscaisError) {
          console.error("Erro ao buscar notas fiscais:", notasFiscaisError);
          toast.error("Erro ao carregar notas fiscais", {
            description: "Não foi possível conectar ao banco de dados."
          });
        } else if (notasFiscaisData) {
          // Verificar quais notas fiscais já existem em contas_receber para evitar duplicidade
          const existingInvoiceNumbers = new Set(allInvoices.map(inv => inv.invoiceNumber.replace('NF-e ', '')));
          
          // Filtrar apenas notas que ainda não estão em contas_receber
          const uniqueNotasFiscais = notasFiscaisData.filter(nota => {
            const notaNumber = nota.numero_nf || '';
            return !existingInvoiceNumbers.has(notaNumber);
          });
          
          // Converter os dados para o formato de Invoice
          const mappedNotasFiscais = uniqueNotasFiscais.map(mapSupabaseToInvoice);
          allInvoices = [...allInvoices, ...mappedNotasFiscais];
          console.log("Dados de notas fiscais carregados:", mappedNotasFiscais.length);
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
