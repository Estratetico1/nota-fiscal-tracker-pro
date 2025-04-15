
import { supabase } from "@/integrations/supabase/client";
import { InvoiceStatus } from "@/types/financial";

export interface Invoice {
  id: string;
  client: string;
  invoiceNumber: string;
  value: number;
  dueDate: string;
  status: InvoiceStatus;
}

// Function to map the data from Supabase to the Invoice format
export const mapSupabaseToInvoice = (item: any, source: 'contas_receber' | 'notas_fiscais'): Invoice => {
  // Determine the status based on the due date and payment date
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
    // For notas_fiscais, calculate the due date as issue date + 30 days
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

// Fetch invoice data from Supabase
export const fetchInvoiceData = async (): Promise<Invoice[]> => {
  let allInvoices: Invoice[] = [];
  
  try {
    // Fetch data from contas_receber
    const { data: contasReceberData, error: contasReceberError } = await supabase
      .from("contas_receber")
      .select("*");
    
    if (contasReceberError) {
      console.error("Erro ao buscar dados de contas a receber:", contasReceberError);
      throw new Error("Erro ao carregar contas a receber");
    } else if (contasReceberData) {
      // Convert the data to Invoice format
      const mappedContasReceber = contasReceberData.map(item => mapSupabaseToInvoice(item, 'contas_receber'));
      allInvoices = [...allInvoices, ...mappedContasReceber];
      console.log("Dados de contas a receber carregados:", mappedContasReceber.length);
    }
    
    return allInvoices;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw new Error("Erro ao carregar dados");
  }
};

// Filter invoices based on criteria
export const filterInvoices = (
  invoices: Invoice[], 
  selectedStatus: InvoiceStatus | "", 
  searchTerm: string, 
  filterDueDate: string
): Invoice[] => {
  return invoices.filter(invoice => {
    // Filter by status
    const statusFilter = selectedStatus === "" || invoice.status === selectedStatus;
    
    // Filter by search term (client or invoice number)
    const searchFilter = searchTerm === "" || 
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by due date
    const dateFilter = filterDueDate === "" || invoice.dueDate === filterDueDate;
    
    return statusFilter && searchFilter && dateFilter;
  });
};

// Calculate summary metrics
export const calculateSummaryMetrics = (invoices: Invoice[]) => {
  const totalPending = invoices.filter(inv => inv.status === "pending").reduce((sum, inv) => sum + inv.value, 0);
  const pendingCount = invoices.filter(inv => inv.status === "pending").length;
  
  const totalPaid = invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.value, 0);
  const paidCount = invoices.filter(inv => inv.status === "paid").length;
  
  const totalOverdue = invoices.filter(inv => inv.status === "overdue").reduce((sum, inv) => sum + inv.value, 0);
  const overdueCount = invoices.filter(inv => inv.status === "overdue").length;
  
  return {
    totalPending,
    pendingCount,
    totalPaid,
    paidCount,
    totalOverdue,
    overdueCount
  };
};
