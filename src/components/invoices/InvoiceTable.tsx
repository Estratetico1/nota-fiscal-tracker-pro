
import { Invoice } from "@/types/invoice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface InvoiceTableProps {
  invoices: Invoice[];
  sortBy: keyof Invoice;
  sortDirection: "asc" | "desc";
  toggleSort: (column: keyof Invoice) => void;
}

const InvoiceStatusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  delivered: "bg-green-100 text-green-800",
  "in-transit": "bg-blue-100 text-blue-800",
  issue: "bg-red-100 text-red-800",
};

export default function InvoiceTable({ 
  invoices, 
  sortBy, 
  sortDirection, 
  toggleSort 
}: InvoiceTableProps) {
  // Function to render the sort indicator
  const renderSortIndicator = (column: keyof Invoice) => {
    if (sortBy === column) {
      return sortDirection === "asc" ? (
        <ArrowUp className="ml-1 h-4 w-4" />
      ) : (
        <ArrowDown className="ml-1 h-4 w-4" />
      );
    }
    return null;
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="w-[100px] cursor-pointer"
              onClick={() => toggleSort("number")}
            >
              <div className="flex items-center">
                Número {renderSortIndicator("number")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => toggleSort("client")}
            >
              <div className="flex items-center">
                Cliente {renderSortIndicator("client")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => toggleSort("clientCNPJ")}
            >
              <div className="flex items-center">
                CNPJ {renderSortIndicator("clientCNPJ")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => toggleSort("issueDate")}
            >
              <div className="flex items-center">
                Emissão {renderSortIndicator("issueDate")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => toggleSort("dueDate")}
            >
              <div className="flex items-center">
                Vencimento {renderSortIndicator("dueDate")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => toggleSort("value")}
            >
              <div className="flex items-center">
                Valor {renderSortIndicator("value")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => toggleSort("status")}
            >
              <div className="flex items-center">
                Status {renderSortIndicator("status")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => toggleSort("paymentStatus")}
            >
              <div className="flex items-center">
                Pagamento {renderSortIndicator("paymentStatus")}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Nenhuma nota fiscal encontrada
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.number}</TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell>{invoice.clientCNPJ}</TableCell>
                <TableCell>{invoice.issueDate}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell>{formatCurrency(invoice.value)}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      InvoiceStatusColors[invoice.status] || ""
                    }`}
                  >
                    {invoice.status === "pending"
                      ? "Pendente"
                      : invoice.status === "delivered"
                      ? "Entregue"
                      : invoice.status === "in-transit"
                      ? "Em Trânsito"
                      : "Problema"}
                  </span>
                </TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
