
export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export type InvoiceType = 'NFe' | 'NFSe' | 'NFCe';
export type DeliveryStatus = 'emailed' | 'viewed' | 'in_transit' | 'delivered';

export interface Invoice {
  id: string;
  number: string;
  issueDate: string;
  dueDate: string;
  value: number;
  status: InvoiceStatus;
  type: InvoiceType;
  items: InvoiceItem[];
  clientId: string;
  paymentMethod: string;
  deliveryStatus: DeliveryStatus;
  cnpj?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceFilter {
  startDate?: Date;
  endDate?: Date;
  status?: InvoiceStatus;
  type?: InvoiceType;
  searchQuery?: string;
}
