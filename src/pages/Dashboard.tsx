
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for the dashboard
const invoiceStats = {
  total: 48,
  pending: 12,
  overdue: 3,
  paid: 33,
  totalValue: 125850.75,
  pendingValue: 35600.00
};

const recentInvoices = [
  { id: "NF-1234", date: "15/04/2023", value: 1250.00, status: "pending" },
  { id: "NF-1233", date: "10/04/2023", value: 980.50, status: "paid" },
  { id: "NF-1232", date: "05/04/2023", value: 3450.00, status: "overdue" },
  { id: "NF-1231", date: "01/04/2023", value: 750.25, status: "paid" },
];

const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo ao seu painel de controle, Cliente</p>
        </header>
        
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardDescription>Total de Notas</CardDescription>
              <CardTitle className="text-2xl">{invoiceStats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Notas emitidas
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardDescription>Pendentes</CardDescription>
              <CardTitle className="text-2xl flex items-center text-amber-500">
                <Clock className="mr-2 h-5 w-5" />
                {invoiceStats.pending}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                R$ {invoiceStats.pendingValue.toLocaleString('pt-BR')}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardDescription>Vencidas</CardDescription>
              <CardTitle className="text-2xl flex items-center text-red-500">
                <AlertCircle className="mr-2 h-5 w-5" />
                {invoiceStats.overdue}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Regularize sua situação
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardDescription>Pagas</CardDescription>
              <CardTitle className="text-2xl flex items-center text-green-500">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                {invoiceStats.paid}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Notas quitadas
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Notas Recentes</CardTitle>
                  <Button asChild variant="ghost" size="sm" className="text-trespharma-teal hover:text-trespharma-teal/80">
                    <Link to="/invoices" className="flex items-center">
                      Ver todas <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <CardDescription>Últimas notas fiscais emitidas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium">{invoice.id}</div>
                          <div className="text-sm text-muted-foreground">{invoice.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">R$ {invoice.value.toLocaleString('pt-BR')}</div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            invoice.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : invoice.status === 'overdue'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                          }`}>
                            {invoice.status === 'paid' 
                              ? 'Paga' 
                              : invoice.status === 'overdue'
                                ? 'Vencida'
                                : 'Pendente'
                            }
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/invoices/${invoice.id}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Próximos Vencimentos</CardTitle>
                <CardDescription>Notas a vencer nos próximos dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium text-red-800">24/04/2023</div>
                      <div className="text-sm font-bold text-red-800">HOJE</div>
                    </div>
                    <div className="text-sm text-gray-700">NF-1232 - R$ 3.450,00</div>
                  </div>
                  
                  <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium text-amber-800">28/04/2023</div>
                      <div className="text-sm font-bold text-amber-800">EM 4 DIAS</div>
                    </div>
                    <div className="text-sm text-gray-700">NF-1234 - R$ 1.250,00</div>
                  </div>
                  
                  <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium text-amber-800">05/05/2023</div>
                      <div className="text-sm font-bold text-amber-800">EM 11 DIAS</div>
                    </div>
                    <div className="text-sm text-gray-700">NF-1238 - R$ 2.800,00</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
