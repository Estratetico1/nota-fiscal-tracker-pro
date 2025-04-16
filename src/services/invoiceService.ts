
import { supabase } from "@/lib/supabase";
import { Invoice } from "@/types/invoice";

export async function fetchInvoices(): Promise<Invoice[]> {
  try {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select('*');
    
    if (error) {
      throw error;
    }

    return data.map((item: any) => ({
      id: item.id,
      number: item.numero_nota || '',
      client: item.cliente || '',
      clientCNPJ: item.cnpj || '',
      issueDate: item.data_emissao || '',
      dueDate: item.data_vencimento || '',
      value: item.valor || 0,
      status: mapStatus(item.status),
      paymentStatus: item.status_pagamento || ''
    }));
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

// Map the status from database to our expected enum values
function mapStatus(status: string): "pending" | "delivered" | "in-transit" | "issue" {
  const statusMap: Record<string, "pending" | "delivered" | "in-transit" | "issue"> = {
    'pendente': 'pending',
    'entregue': 'delivered',
    'em_transito': 'in-transit',
    'problema': 'issue',
    // Add more mappings as needed
  };
  
  return statusMap[status?.toLowerCase()] || 'pending';
}
