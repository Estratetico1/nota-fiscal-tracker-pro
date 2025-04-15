
import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { InvoiceTable } from "@/components/dashboard/InvoiceTable";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, Upload, Filter, Download } from "lucide-react";
import { useInvoicesData } from "@/hooks/useInvoicesData";

const InvoiceList: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isLoading,
    filteredInvoices,
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType
  } = useInvoicesData();

  // Map SupabaseInvoice to the format required by InvoiceTable
  const mappedInvoices = filteredInvoices.map(invoice => {
    // Determinar status de entrega
    let status = "pending";
    if (invoice.status_entrega === "entregue") {
      status = "delivered";
    } else if (invoice.status_entrega === "em_transito") {
      status = "in-transit";
    } else if (invoice.status_entrega === "problema") {
      status = "issue";
    }
    
    // Determinar status de pagamento (simulado com base na data de emissão)
    let paymentStatus = "pending";
    if (invoice.data_emissao) {
      const emissionDate = new Date(invoice.data_emissao);
      const currentDate = new Date();
      const diffTime = currentDate.getTime() - emissionDate.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);

      if (diffDays > 30) {
        paymentStatus = "overdue";
      } else if (diffDays > 15) {
        paymentStatus = "paid";
      }
    }

    return {
      id: String(invoice.id),
      number: invoice.numero_nf ? `NF-e ${invoice.numero_nf}` : "Sem número",
      client: invoice.cliente || "Cliente não especificado",
      clientCNPJ: invoice.cod_cliente || "",
      issueDate: invoice.data_emissao || "-",
      dueDate: invoice.data_emissao ? new Date(new Date(invoice.data_emissao).getTime() + 30*24*60*60*1000).toISOString().split('T')[0] : "-",
      value: Number(invoice.valor_total) || 0,
      status: status,
      paymentStatus: paymentStatus
    };
  });

  const handleViewInvoice = (id: string) => {
    navigate(`/invoices/${id}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notas Fiscais</h1>
            <p className="text-gray-500 mt-1">Gerencie suas notas fiscais.</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate("/import")}>
              <Upload className="h-4 w-4 mr-2" />
              Importar Notas
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-5 mb-6">
              <div className="md:col-span-1">
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Buscar por..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="number">Número da NF</SelectItem>
                    <SelectItem value="cnpj">CNPJ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder={searchType === "number" ? "Buscar por número de nota..." : 
                                searchType === "cnpj" ? "Buscar por CNPJ..." : 
                                "Buscar notas fiscais..."}
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="py-10 text-center">Carregando notas fiscais...</div>
            ) : (
              <>
                <InvoiceTable 
                  invoices={mappedInvoices}
                  onViewInvoice={handleViewInvoice}
                />
                
                <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                  <div>
                    Mostrando 1-{filteredInvoices.length} de {filteredInvoices.length} notas
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Anterior
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Próxima
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default InvoiceList;
