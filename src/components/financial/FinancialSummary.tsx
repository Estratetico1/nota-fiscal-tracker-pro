
import React from "react";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { Banknote, AlertCircle, Mail } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";

interface FinancialSummaryProps {
  totalPending: number;
  pendingCount: number;
  totalPaid: number;
  paidCount: number;
  totalOverdue: number;
  overdueCount: number;
  onSendAllReminders: () => void;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  totalPending,
  pendingCount,
  totalPaid,
  paidCount,
  totalOverdue,
  overdueCount,
  onSendAllReminders,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatusCard 
        title="A Receber" 
        value={formatCurrency(totalPending)}
        icon={<Banknote className="h-6 w-6" />}
        variant="yellow"
        trend={{ value: 15, isPositive: true }}
      />
      <StatusCard 
        title="Recebidos" 
        value={formatCurrency(totalPaid)}
        icon={<Banknote className="h-6 w-6" />}
        variant="teal"
        trend={{ value: 8, isPositive: true }}
      />
      <StatusCard 
        title="Inadimplentes" 
        value={formatCurrency(totalOverdue)}
        icon={<AlertCircle className="h-6 w-6" />}
        variant="red"
        trend={{ value: 3, isPositive: false }}
        action={
          <Button size="sm" variant="destructive" className="ml-auto" onClick={onSendAllReminders}>
            <Mail className="h-4 w-4 mr-1" />
            Enviar Cobrança
          </Button>
        }
      />
    </div>
  );
};
