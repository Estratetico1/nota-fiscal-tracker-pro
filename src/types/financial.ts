
export type InvoiceStatus = "pending" | "paid" | "overdue";

export interface Invoice {
  id: string;
  client: string;
  invoiceNumber: string;
  value: number;
  dueDate: string;
  status: InvoiceStatus;
}

export interface SupabaseInvoice {
  id: number;
  cliente: string | null;
  cod_cliente: string | null;
  numero_nf: string | null;
  valor_total: number | null;
  data_emissao: string | null;
  status_entrega: string | null;
  cidade: string | null;
  uf: string | null;
  transportadora: string | null;
}
