
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { InvoiceStatus } from "@/types/financial";

interface FinancialFiltersProps {
  selectedStatus: InvoiceStatus | "";
  onStatusChange: (status: InvoiceStatus | "") => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  dueDate: string;
  onDueDateChange: (date: string) => void;
  onApplyFilters?: (status: InvoiceStatus | "", search: string, dueDate: string) => void;
}

export const FinancialFilters: React.FC<FinancialFiltersProps> = ({
  selectedStatus,
  onStatusChange,
  searchTerm,
  onSearchChange,
  dueDate,
  onDueDateChange,
  onApplyFilters
}) => {
  const handleFilterApply = () => {
    if (onApplyFilters) {
      onApplyFilters(selectedStatus, searchTerm, dueDate);
    }
    console.log("Aplicando filtros", { searchTerm, dueDate, selectedStatus });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Buscar cliente ou número..." 
              className="pl-9" 
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          </div>
          <div>
            <Input 
              type="date" 
              placeholder="Data de vencimento" 
              className="w-full" 
              value={dueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
            />
          </div>
          <div>
            <select 
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value as InvoiceStatus | "")}
            >
              <option value="">Todos os status</option>
              <option value="pending">A Receber</option>
              <option value="paid">Recebido</option>
              <option value="overdue">Inadimplente</option>
            </select>
          </div>
          <div>
            <Button className="w-full" onClick={handleFilterApply}>Filtrar</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
