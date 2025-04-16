
import { Loader2 } from "lucide-react";
import InvoiceFilter from "@/components/invoices/InvoiceFilter";
import InvoiceTable from "@/components/invoices/InvoiceTable";
import useInvoiceData from "@/hooks/useInvoiceData";

const InvoiceList = () => {
  const { invoices, loading, filters, updateFilter, toggleSort } = useInvoiceData();

  return (
    <div className="container mx-auto py-8 h-screen overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Notas Fiscais</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <InvoiceFilter 
            filters={filters} 
            updateFilter={updateFilter} 
          />
        </div>
        
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <InvoiceTable
              invoices={invoices}
              sortBy={filters.sortBy}
              sortDirection={filters.sortDirection}
              toggleSort={toggleSort}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
