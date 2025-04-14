
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { formatCurrency } from "@/lib/format";

interface Invoice {
  id: string;
  number: string;
  client: string;
  issueDate: string;
  dueDate: string;
  value: number;
  status: 'pending' | 'delivered' | 'in-transit' | 'issue';
  paymentStatus: 'paid' | 'pending' | 'overdue';
}

interface InvoiceTableProps {
  invoices: Invoice[];
  onViewInvoice: (id: string) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onViewInvoice,
}) => {
  const getDeliveryStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">Entregue</Badge>;
      case 'in-transit':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">Em Trânsito</Badge>;
      case 'issue':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">Ocorrência</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200">Pendente</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: Invoice['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">Pago</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">Vencido</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200">Pendente</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nº Nota</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Emissão</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status Entrega</TableHead>
            <TableHead>Status Pagamento</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.number}</TableCell>
              <TableCell>{invoice.client}</TableCell>
              <TableCell>{invoice.issueDate}</TableCell>
              <TableCell>{invoice.dueDate}</TableCell>
              <TableCell>{formatCurrency(invoice.value)}</TableCell>
              <TableCell>{getDeliveryStatusBadge(invoice.status)}</TableCell>
              <TableCell>{getPaymentStatusBadge(invoice.paymentStatus)}</TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onViewInvoice(invoice.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
