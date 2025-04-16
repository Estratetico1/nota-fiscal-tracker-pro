
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search } from "lucide-react";
import { InvoiceFilterState } from "@/types/invoice";

interface InvoiceFilterProps {
  filters: InvoiceFilterState;
  updateFilter: (filterName: keyof InvoiceFilterState, value: any) => void;
}

const InvoiceFilter = ({ filters, updateFilter }: InvoiceFilterProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Filtrar Notas Fiscais</h2>
      
      <div className="flex flex-col gap-2">
        <Label htmlFor="searchType">Pesquisar por:</Label>
        <RadioGroup 
          id="searchType" 
          className="flex gap-4"
          value={filters.searchBy}
          onValueChange={(value) => updateFilter('searchBy', value as "number" | "cnpj")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="number" id="search-number" />
            <Label htmlFor="search-number">Número da Nota</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cnpj" id="search-cnpj" />
            <Label htmlFor="search-cnpj">CNPJ</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={
            filters.searchBy === "number"
              ? "Buscar por número da nota..."
              : "Buscar por CNPJ..."
          }
          className="pl-8"
          value={filters.searchTerm}
          onChange={(e) => updateFilter("searchTerm", e.target.value)}
        />
      </div>
    </div>
  );
};

export default InvoiceFilter;
