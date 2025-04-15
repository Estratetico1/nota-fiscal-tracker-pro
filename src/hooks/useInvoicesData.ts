
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { fetchNotasFiscaisData } from "@/services/financialService";
import { SupabaseInvoice } from "@/types/financial";

export const useInvoicesData = () => {
  const [invoicesData, setInvoicesData] = useState<SupabaseInvoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("all");
  
  useEffect(() => {
    async function loadInvoicesData() {
      setIsLoading(true);
      try {
        const data = await fetchNotasFiscaisData();
        setInvoicesData(data);
        console.log("Total de notas fiscais carregadas:", data.length);
      } catch (error) {
        console.error("Erro na requisição:", error);
        toast.error("Erro ao carregar dados", {
          description: "Ocorreu um erro inesperado."
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadInvoicesData();
  }, []);
  
  // Filter invoices based on search criteria
  const filteredInvoices = invoicesData.filter(invoice => {
    if (!searchTerm) return true;
    
    if (searchType === "number") {
      return invoice.numero_nf?.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchType === "cnpj") {
      return invoice.cod_cliente?.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      // Search in all fields
      return (
        invoice.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.numero_nf?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.cod_cliente?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });
  
  return {
    isLoading,
    invoicesData,
    filteredInvoices,
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType
  };
};
