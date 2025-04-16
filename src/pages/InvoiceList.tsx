
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, FileDown, Eye, Calendar } from "lucide-react";
import { InvoiceStatus, InvoiceType } from "@/types/invoice";

// Mock invoices data
const invoicesData = [
  { id: "1", number: "NF-1240", issueDate: "2023-04-20", dueDate: "2023-05-20", value: 3450.75, status: "pending" as InvoiceStatus, type: "NFe" as InvoiceType, cnpj: "12.345.678/0001-99" },
  { id: "2", number: "NF-1239", issueDate: "2023-04-15", dueDate: "2023-05-15", value: 1250.00, status: "paid" as InvoiceStatus, type: "NFe" as InvoiceType, cnpj: "12.345.678/0001-99" },
  { id: "3", number: "NF-1238", issueDate: "2023-04-10", dueDate: "2023-05-10", value: 5800.50, status: "paid" as InvoiceStatus, type: "NFSe" as InvoiceType, cnpj: "12.345.678/0001-99" },
  { id: "4", number: "NF-1237", issueDate: "2023-04-05", dueDate: "2023-05-05", value: 760.25, status: "paid" as InvoiceStatus, type: "NFe" as InvoiceType, cnpj: "12.345.678/0001-99" },
  { id: "5", number: "NF-1236", issueDate: "2023-04-01", dueDate: "2023-05-01", value: 2100.00, status: "overdue" as InvoiceStatus, type: "NFe" as InvoiceType, cnpj: "12.345.678/0001-99" },
  { id: "6", number: "NF-1235", issueDate: "2023-03-28", dueDate: "2023-04-28", value: 950.50, status: "overdue" as InvoiceStatus, type: "NFCe" as InvoiceType, cnpj: "12.345.678/0001-99" },
  { id: "7", number: "NF-1234", issueDate: "2023-03-25", dueDate: "2023-04-25", value: 3275.00, status: "cancelled" as InvoiceStatus, type: "NFe" as InvoiceType, cnpj: "12.345.678/0001-99" },
];

const InvoiceList = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [invoiceType, setInvoiceType] = useState<string>("");
  
  // Filter invoices based on search, status, and type
  const filteredInvoices = invoicesData.filter(invoice => {
    return (
      (search === "" || 
       invoice.number.toLowerCase().includes(search.toLowerCase()) || 
       invoice.cnpj?.toLowerCase().includes(search.toLowerCase())
      ) &&
      (status === "" || invoice.status === status) &&
      (invoiceType === "" || invoice.type === invoiceType)
    );
  });
  
  // Status badge styling
  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paga</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pendente</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Vencida</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cancelada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
                  placeholder="Buscar por Nº da NF ou CNPJ" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:w-1/2">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="paid">Paga</SelectItem>
                    <SelectItem value="overdue">Vencida</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={invoiceType} onValueChange={setInvoiceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="NFe">NF-e</SelectItem>
                    <SelectItem value="NFSe">NFS-e</SelectItem>
                    <SelectItem value="NFCe">NFC-e</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Período
                </Button>
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
                    <TableHead>Emissão</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Nenhuma nota fiscal encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.number}</TableCell>
                        <TableCell>{new Date(invoice.issueDate).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>R$ {invoice.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>{invoice.type}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="icon" title="Visualizar">
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
    </div>
  );
};

export default InvoiceList;
