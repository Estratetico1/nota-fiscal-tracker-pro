
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  FileDown, 
  Eye, 
  Calendar, 
  PackageOpen, 
  TruckIcon, 
  CheckCircle, 
  AlertTriangle,
  Filter
} from "lucide-react";
import { InvoiceStatus, InvoiceType } from "@/types/invoice";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Invoice {
  id: number;
  numero_nf: string;
  data_emissao: string | null;
  cliente: string | null;
  valor_total: number | null;
  status_entrega: string | null;
  transportadora: string | null;
  cidade: string | null;
  uf: string | null;
  valor_frete: number | null;
  regiao: string | null;
  numero_cte: string | null;
  cod_cliente: string | null;
  codigo_cliente: string | null;
  frete: number | null;
  perc_frete: number | null;
  cmv_total: number | null;
  data_ultima_atualizacao: string | null;
}

const InvoiceList = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uniqueRegions, setUniqueRegions] = useState<string[]>([]);
  const [uniqueStatuses, setUniqueStatuses] = useState<string[]>([]);
  
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('notas_fiscais')
          .select('*');
        
        if (error) throw error;
        
        setInvoices(data || []);

        // Extract unique regions and statuses for filters
        const regions = [...new Set(data?.map(item => item.regiao).filter(Boolean) || [])];
        setUniqueRegions(regions as string[]);

        const statuses = [...new Set(data?.map(item => item.status_entrega).filter(Boolean) || [])];
        setUniqueStatuses(statuses as string[]);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar notas fiscais",
          description: error.message || "Ocorreu um erro ao carregar as notas fiscais.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);
  
  // Filter invoices based on search, status, and region
  const filteredInvoices = invoices.filter(invoice => {
    return (
      (search === "" || 
       (invoice.numero_nf && invoice.numero_nf.toLowerCase().includes(search.toLowerCase())) || 
       (invoice.cliente && invoice.cliente.toLowerCase().includes(search.toLowerCase()))
      ) &&
      (status === "" || (invoice.status_entrega && invoice.status_entrega.toLowerCase() === status.toLowerCase())) &&
      (region === "" || (invoice.regiao && invoice.regiao.toLowerCase() === region.toLowerCase()))
    );
  });

  // Format date to Brazilian format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Status badge styling
  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Desconhecido</Badge>;
    
    switch (status.toLowerCase()) {
      case "entregue":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Entregue
        </Badge>;
      case "em trânsito":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 flex items-center gap-1">
          <TruckIcon className="h-3 w-3" />
          Em Trânsito
        </Badge>;
      case "pendente":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Pendente
        </Badge>;
      case "cancelada":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelada</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  const viewInvoiceDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Notas Fiscais</h1>
          <p className="text-gray-600">Gerencie todas as suas notas fiscais</p>
        </header>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Refine a sua busca de notas fiscais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Buscar por Nº da NF ou Cliente" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:w-1/2">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status de Entrega" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {uniqueStatuses.map((statusOption) => (
                      <SelectItem key={statusOption} value={statusOption}>
                        {statusOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Região" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    {uniqueRegions.map((regionOption) => (
                      <SelectItem key={regionOption} value={regionOption}>
                        {regionOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Período
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="flex flex-col gap-2">
                      <h4 className="font-medium">Selecionar período</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Data inicial</p>
                          <Input type="date" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Data final</p>
                          <Input type="date" />
                        </div>
                      </div>
                      <Button className="mt-2">Aplicar</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Notas Fiscais</CardTitle>
              <div className="text-sm text-muted-foreground">
                {filteredInvoices.length} notas encontradas
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Nota</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Emissão</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status Entrega</TableHead>
                    <TableHead>Região</TableHead>
                    <TableHead>UF</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        Carregando notas fiscais...
                      </TableCell>
                    </TableRow>
                  ) : filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        Nenhuma nota fiscal encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.numero_nf}</TableCell>
                        <TableCell>{invoice.cliente}</TableCell>
                        <TableCell>{formatDate(invoice.data_emissao)}</TableCell>
                        <TableCell>R$ {invoice.valor_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '-'}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status_entrega)}</TableCell>
                        <TableCell>{invoice.regiao || '-'}</TableCell>
                        <TableCell>{invoice.uf || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              title="Visualizar"
                              onClick={() => viewInvoiceDetails(invoice)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" title="Download">
                              <FileDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Nota Fiscal</DialogTitle>
            <DialogDescription>
              Nota Fiscal {selectedInvoice?.numero_nf}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Informações Gerais</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Número da NF</p>
                    <p className="font-semibold">{selectedInvoice?.numero_nf || '-'}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Cliente</p>
                    <p className="font-semibold">{selectedInvoice?.cliente || '-'}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Código do Cliente</p>
                    <p className="font-semibold">{selectedInvoice?.codigo_cliente || selectedInvoice?.cod_cliente || '-'}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Data de Emissão</p>
                    <p className="font-semibold">{formatDate(selectedInvoice?.data_emissao)}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Última Atualização</p>
                    <p className="font-semibold">{selectedInvoice?.data_ultima_atualizacao ? formatDate(selectedInvoice.data_ultima_atualizacao) : '-'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Valores</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Valor Total</p>
                    <p className="text-lg font-bold text-green-700">
                      R$ {selectedInvoice?.valor_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '-'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Custo das Mercadorias Vendidas (CMV)</p>
                    <p className="font-semibold">
                      R$ {selectedInvoice?.cmv_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Informações de Entrega</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Status de Entrega</p>
                    <div className="mt-1">
                      {selectedInvoice?.status_entrega 
                        ? getStatusBadge(selectedInvoice.status_entrega) 
                        : <span className="text-gray-500">Não informado</span>
                      }
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Transportadora</p>
                    <p className="font-semibold">{selectedInvoice?.transportadora || '-'}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Número do CT-e</p>
                    <p className="font-semibold">{selectedInvoice?.numero_cte || '-'}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Localização</p>
                    <p className="font-semibold">
                      {selectedInvoice?.cidade && selectedInvoice?.uf 
                        ? `${selectedInvoice.cidade} - ${selectedInvoice.uf}` 
                        : '-'
                      }
                    </p>
                    <p className="text-sm text-gray-500">{selectedInvoice?.regiao || ''}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Informações de Frete</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Valor do Frete</p>
                    <p className="font-semibold">
                      R$ {selectedInvoice?.valor_frete?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '-'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Frete</p>
                    <p className="font-semibold">
                      R$ {selectedInvoice?.frete?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '-'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Percentual de Frete</p>
                    <p className="font-semibold">
                      {selectedInvoice?.perc_frete ? `${selectedInvoice.perc_frete}%` : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline">Fazer Download</Button>
            <Button variant="outline">Ver XML</Button>
            <Button className="bg-trespharma-teal hover:bg-trespharma-teal/90">
              Solicitar Segunda Via
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceList;

