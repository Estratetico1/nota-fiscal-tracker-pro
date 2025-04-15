
export type InvoiceStatus = "pending" | "paid" | "overdue";

export interface Invoice {
  id: string;
  client: string;
  invoiceNumber: string;
  value: number;
  dueDate: string;
  status: InvoiceStatus;
}
