
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { InvoiceTable } from "@/components/dashboard/InvoiceTable";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, Upload, Filter, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

// Define tipos para os dados
type InvoiceStatus = "pending" | "in-transit" | "delivered" | "issue";
type PaymentStatus = "pending" | "paid" | "overdue";

interface Invoice {
  id: string;
  number: string;
  client: string;
  clientCNPJ: string;
  issueDate: string;
  dueDate: string;
  value: number;
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
}

const InvoiceList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [deliveryStatus, setDeliveryStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      try {
        const { data: notasFiscais, error } = await supabase
          .from("notas_fiscais")
          .select("*");

        if (error) {
          console.error("Erro ao buscar notas fiscais:", error);
          toast.error("Erro ao carregar notas fiscais");
          return;
        }

        console.log("Dados brutos de notas fiscais:", notasFiscais);

        // Mapear os dados para o formato de Invoice
        const mappedInvoices: Invoice[] = (notasFiscais || []).map((nota: any) => {
          // Determinar status de entrega
          let status: InvoiceStatus = "pending";
          if (nota.status_entrega === "entregue") {
            status = "delivered";
          } else if (nota.status_entrega === "em_transito") {
            status = "in-transit";
          } else if (nota.status_entrega === "problema") {
            status = "issue";
          }
          
          // Determinar status de pagamento (simulado com base na data de emissão)
          let paymentStatus: PaymentStatus = "pending";
          if (nota.data_emissao) {
            const emissionDate = new Date(nota.data_emissao);
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
            id: String(nota.id),
            number: nota.numero_nf ? `NF-e ${nota.numero_nf}` : "Sem número",
            client: nota.cliente || "Cliente não especificado",
            clientCNPJ: nota.cod_cliente || "",
            issueDate: nota.data_emissao || "-",
            dueDate: nota.data_emissao ? new Date(new Date(nota.data_emissao).getTime() + 30*24*60*60*1000).toISOString().split('T')[0] : "-",
            value: Number(nota.valor_total) || 0,
            status: status,
            paymentStatus: paymentStatus
          };
        });

        console.log("Notas fiscais carregadas:", mappedInvoices.length);
        setInvoices(mappedInvoices);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast.error("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Filtragem de notas fiscais
  const filteredInvoices = invoices.filter(invoice => {
    // Filtragem por termo de busca baseado no tipo de busca selecionado
    let matchesSearch = true;
    if (searchTerm !== "") {
      if (searchType === "all") {
        matchesSearch = 
          invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.clientCNPJ.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchType === "number") {
        matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchType === "cnpj") {
        matchesSearch = invoice.clientCNPJ.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchType === "client") {
        matchesSearch = invoice.client.toLowerCase().includes(searchTerm.toLowerCase());
      }
    }
    
    const matchesDeliveryStatus = deliveryStatus === "all" || invoice.status === deliveryStatus;
    const matchesPaymentStatus = paymentStatus === "all" || invoice.paymentStatus === paymentStatus;
    
    return matchesSearch && matchesDeliveryStatus && matchesPaymentStatus;
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
                    <SelectItem value="client">Nome do Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder={searchType === "number" ? "Buscar por número de nota..." : 
                                searchType === "cnpj" ? "Buscar por CNPJ..." : 
                                searchType === "client" ? "Buscar por cliente..." :
                                "Buscar notas fiscais..."}
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Select value={deliveryStatus} onValueChange={setDeliveryStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status de Entrega" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in-transit">Em Trânsito</SelectItem>
                    <SelectItem value="delivered">Entregue</SelectItem>
                    <SelectItem value="issue">Com Ocorrência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status de Pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="overdue">Vencido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-5 flex justify-end">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros Avançados
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="py-10 text-center">Carregando notas fiscais...</div>
            ) : (
              <>
                <InvoiceTable 
                  invoices={filteredInvoices}
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
