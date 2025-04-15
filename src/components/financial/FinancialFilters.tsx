
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { InvoiceStatus } from "@/pages/Financial";

interface FinancialFiltersProps {
  selectedStatus: InvoiceStatus | "";
  onStatusChange: (status: InvoiceStatus | "") => void;
}

export const FinancialFilters: React.FC<FinancialFiltersProps> = ({
  selectedStatus,
  onStatusChange,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');

  const handleFilterApply = () => {
    // Aqui podemos implementar a lógica adicional de filtros
    // Por enquanto, estamos apenas usando o filtro de status diretamente
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
              placeholder="Buscar cliente..." 
              className="pl-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          </div>
          <div>
            <Input 
              type="date" 
              placeholder="Data de vencimento" 
              className="w-full" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
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
