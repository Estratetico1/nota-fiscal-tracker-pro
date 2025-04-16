
import { useState, useEffect } from "react";
import { fetchInvoices } from "@/services/invoiceService";
import { Invoice, InvoiceFilterState } from "@/types/invoice";
import { toast } from "sonner";

export default function useInvoiceData() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<InvoiceFilterState>({
    searchTerm: "",
    searchBy: "number",
    sortBy: "issueDate",
    sortDirection: "desc",
    statusFilter: "all"
  });

  useEffect(() => {
    const loadInvoices = async () => {
      setLoading(true);
      try {
        const data = await fetchInvoices();
        setInvoices(data);
      } catch (error) {
        console.error("Failed to load invoices:", error);
        toast.error("Failed to load invoices");
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  const filteredInvoices = invoices
    .filter((invoice) => {
      // Filter by search term
      if (filters.searchTerm) {
        if (filters.searchBy === "number") {
          return invoice.number.toLowerCase().includes(filters.searchTerm.toLowerCase());
        } else if (filters.searchBy === "cnpj") {
          return invoice.clientCNPJ.toLowerCase().includes(filters.searchTerm.toLowerCase());
        }
      }
      return true;
    })
    .filter((invoice) => {
      // Filter by status
      if (filters.statusFilter !== "all") {
        return invoice.status === filters.statusFilter;
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filters.sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // For numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return filters.sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

  const updateFilter = (filterName: keyof InvoiceFilterState, value: any) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const toggleSort = (column: keyof Invoice) => {
    setFilters(prev => {
      if (prev.sortBy === column) {
        return {
          ...prev,
          sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        ...prev,
        sortBy: column,
        sortDirection: 'asc'
      };
    });
  };

  return {
    invoices: filteredInvoices,
    loading,
    filters,
    updateFilter,
    toggleSort
  };
}
