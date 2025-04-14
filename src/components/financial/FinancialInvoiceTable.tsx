
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/format";
import { Mail, Eye, Banknote, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Invoice {
  id: string;
  client: string;
  invoiceNumber: string;
  value: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue";
}

interface FinancialInvoiceTableProps {
  invoices: Invoice[];
  onSendPaymentReminder: (invoiceId: string) => void;
}

export const FinancialInvoiceTable: React.FC<FinancialInvoiceTableProps> = ({
  invoices,
  onSendPaymentReminder,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">A Receber</Badge>;
      case "paid":
        return <Badge className="bg-green-500">Recebido</Badge>;
      case "overdue":
        return <Badge className="bg-red-500">Inadimplente</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Faturas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Nº da Fatura</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow 
                  key={invoice.id}
                  className={invoice.status === "overdue" ? "bg-red-50" : ""} // Highlight overdue rows
                >
                  <TableCell className="font-medium">{invoice.client}</TableCell>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{formatCurrency(invoice.value)}</TableCell>
                  <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {invoice.status === "overdue" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onSendPaymentReminder(invoice.id)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Ações
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Banknote className="mr-2 h-4 w-4" />
                            {invoice.status === "paid" ? "Estornar" : "Marcar como pago"}
                          </DropdownMenuItem>
                          {invoice.status === "overdue" && (
                            <DropdownMenuItem onClick={() => onSendPaymentReminder(invoice.id)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Enviar cobrança
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Baixar boleto
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
