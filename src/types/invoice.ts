
export interface Invoice {
  id: string;
  number: string;
  client: string;
  clientCNPJ: string;
  issueDate: string;
  dueDate: string;
  value: number;
  status: "pending" | "delivered" | "in-transit" | "issue";
  paymentStatus: string;
}

export interface InvoiceFilterState {
  searchTerm: string;
  searchBy: "number" | "cnpj";
  sortBy: keyof Invoice;
  sortDirection: "asc" | "desc";
  statusFilter: string;
}
