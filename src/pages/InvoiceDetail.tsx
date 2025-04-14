
import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Printer, Download, TruckIcon, DollarSign, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { formatCurrency, formatDate } from "@/lib/format";
import { Separator } from "@/components/ui/separator";

// Mock data
const invoiceData = {
  id: "1",
  number: "NF-e 1234",
  client: {
    name: "Farmácia São Paulo",
    cnpj: "12.345.678/0001-90",
    address: "Rua das Farmácias, 123 - São Paulo, SP"
  },
  issueDate: "15/04/2023",
  dueDate: "15/05/2023",
  value: 5678.90,
  status: "delivered" as const,
  paymentStatus: "paid" as const,
  items: [
    { id: "1", description: "Medicamento A", quantity: 100, unitValue: 12.50, totalValue: 1250.00 },
    { id: "2", description: "Medicamento B", quantity: 50, unitValue: 45.00, totalValue: 2250.00 },
    { id: "3", description: "Medicamento C", quantity: 75, unitValue: 29.05, totalValue: 2178.90 }
  ],
  delivery: {
    carrier: "Transportadora Rápida",
    driver: "João Silva",
    vehicle: "Furgão - ABC-1234",
    trackingCode: "TR12345678",
    deliveryDate: "20/04/2023",
    timeline: [
      { date: "15/04/2023", time: "14:30", status: "Nota fiscal emitida", description: "Nota fiscal emitida pelo cliente" },
      { date: "16/04/2023", time: "09:15", status: "Aguardando coleta", description: "Mercadoria separada para entrega" },
      { date: "17/04/2023", time: "10:45", status: "Em trânsito", description: "Mercadoria coletada pela transportadora" },
      { date: "20/04/2023", time: "15:20", status: "Entregue", description: "Mercadoria entregue ao cliente" }
    ]
  },
  financial: {
    method: "Boleto Bancário",
    installments: 1,
    payments: [
      { date: "15/05/2023", value: 5678.90, status: "Pago" }
    ]
  }
};

const InvoiceDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const getDeliveryStatusBadge = (status: string) => {
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

  const getPaymentStatusBadge = (status: string) => {
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
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {invoiceData.number}
              </h1>
              <p className="text-gray-500 mt-1">
                {invoiceData.client.name} • Emitida em {invoiceData.issueDate}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Baixar XML
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Informações da Nota Fiscal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Cliente</div>
                  <div className="mt-1">{invoiceData.client.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">CNPJ</div>
                  <div className="mt-1">{invoiceData.client.cnpj}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Endereço</div>
                  <div className="mt-1">{invoiceData.client.address}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Valor Total</div>
                  <div className="mt-1 font-semibold">{formatCurrency(invoiceData.value)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Status de Entrega</div>
                  <div className="mt-1">{getDeliveryStatusBadge(invoiceData.status)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Status de Pagamento</div>
                  <div className="mt-1">{getPaymentStatusBadge(invoiceData.paymentStatus)}</div>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Itens da Nota</div>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="py-2 px-3 text-left font-medium">Descrição</th>
                        <th className="py-2 px-3 text-right font-medium">Qtd.</th>
                        <th className="py-2 px-3 text-right font-medium">Valor Unit.</th>
                        <th className="py-2 px-3 text-right font-medium">Valor Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.items.map(item => (
                        <tr key={item.id} className="border-b">
                          <td className="py-2 px-3">{item.description}</td>
                          <td className="py-2 px-3 text-right">{item.quantity}</td>
                          <td className="py-2 px-3 text-right">{formatCurrency(item.unitValue)}</td>
                          <td className="py-2 px-3 text-right">{formatCurrency(item.totalValue)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={3} className="py-2 px-3 text-right font-medium">Total</td>
                        <td className="py-2 px-3 text-right font-medium">{formatCurrency(invoiceData.value)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-3 rounded-md bg-teal-50">
                <div className="p-2 rounded-full bg-teal-100">
                  <FileText className="h-5 w-5 text-teal-700" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium">Tipo de Documento</div>
                  <div className="text-sm text-gray-500">Nota Fiscal Eletrônica</div>
                </div>
              </div>
              
              <div className="flex items-center p-3 rounded-md bg-orange-50">
                <div className="p-2 rounded-full bg-orange-100">
                  <TruckIcon className="h-5 w-5 text-orange-700" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium">Transportadora</div>
                  <div className="text-sm text-gray-500">{invoiceData.delivery.carrier}</div>
                </div>
              </div>
              
              <div className="flex items-center p-3 rounded-md bg-blue-50">
                <div className="p-2 rounded-full bg-blue-100">
                  <DollarSign className="h-5 w-5 text-blue-700" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium">Forma de Pagamento</div>
                  <div className="text-sm text-gray-500">{invoiceData.financial.method}</div>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-sm font-medium mb-1">Vencimento</div>
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div>
                    <div className="text-gray-500 text-xs">Data</div>
                    <div className="font-medium">{invoiceData.dueDate}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Status</div>
                    <div>{getPaymentStatusBadge(invoiceData.paymentStatus)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="timeline">
          <TabsList>
            <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
            <TabsTrigger value="delivery">Entrega</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
          </TabsList>
          <TabsContent value="timeline" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-6">
                  {invoiceData.delivery.timeline.map((item, index) => (
                    <div key={index} className="relative pl-8 pb-6">
                      {index !== invoiceData.delivery.timeline.length - 1 && (
                        <div className="absolute left-[11px] top-2 h-full w-0.5 bg-gray-200"></div>
                      )}
                      <div className="absolute left-0 top-0 h-6 w-6 rounded-full bg-teal-100 border-4 border-white flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                      </div>
                      <div className="text-sm text-gray-500">{item.date} • {item.time}</div>
                      <div className="font-medium">{item.status}</div>
                      <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="delivery" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Transportadora</div>
                    <div className="mt-1">{invoiceData.delivery.carrier}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Motorista</div>
                    <div className="mt-1">{invoiceData.delivery.driver}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Veículo</div>
                    <div className="mt-1">{invoiceData.delivery.vehicle}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Código de Rastreamento</div>
                    <div className="mt-1">{invoiceData.delivery.trackingCode}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Data de Entrega</div>
                    <div className="mt-1">{invoiceData.delivery.deliveryDate}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Status</div>
                    <div className="mt-1">{getDeliveryStatusBadge(invoiceData.status)}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="bg-gray-50 p-4 rounded-md flex items-center justify-center text-gray-500 h-[200px]">
                    Mapa de Localização de Entrega
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financial" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Valor Total</div>
                    <div className="mt-1 font-semibold">{formatCurrency(invoiceData.value)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Método de Pagamento</div>
                    <div className="mt-1">{invoiceData.financial.method}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Parcelas</div>
                    <div className="mt-1">{invoiceData.financial.installments}x</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">Histórico de Pagamentos</div>
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="py-2 px-3 text-left font-medium">Data</th>
                          <th className="py-2 px-3 text-right font-medium">Valor</th>
                          <th className="py-2 px-3 text-right font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.financial.payments.map((payment, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 px-3">{payment.date}</td>
                            <td className="py-2 px-3 text-right">{formatCurrency(payment.value)}</td>
                            <td className="py-2 px-3 text-right">
                              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                                {payment.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default InvoiceDetail;
