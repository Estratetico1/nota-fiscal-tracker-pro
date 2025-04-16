
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, AlertCircle, CheckCircle2, Clock, BarChart, PieChart } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

const Dashboard = () => {
  const [invoiceStats, setInvoiceStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    inTransit: 0,
    totalValue: 0,
    pendingValue: 0
  });
  
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all invoices
        const { data: invoices, error } = await supabase
          .from('notas_fiscais')
          .select('*');
        
        if (error) throw error;
        
        // Calculate statistics
        const stats = {
          total: invoices?.length || 0,
          pending: invoices?.filter(inv => inv.status_entrega === 'pendente').length || 0,
          delivered: invoices?.filter(inv => inv.status_entrega === 'entregue').length || 0,
          inTransit: invoices?.filter(inv => inv.status_entrega === 'em trânsito').length || 0,
          totalValue: invoices?.reduce((sum, inv) => sum + (inv.valor_total || 0), 0) || 0,
          pendingValue: invoices?.filter(inv => inv.status_entrega === 'pendente').reduce((sum, inv) => sum + (inv.valor_total || 0), 0) || 0
        };
        
        setInvoiceStats(stats);
        
        // Get recent invoices
        const recent = invoices
          ?.sort((a, b) => {
            const dateA = a.data_emissao ? new Date(a.data_emissao).getTime() : 0;
            const dateB = b.data_emissao ? new Date(b.data_emissao).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 4) || [];
        
        setRecentInvoices(recent);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: error.message || "Ocorreu um erro ao carregar os dados do dashboard.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  
  // Data for status chart
  const statusData = [
    { name: 'Entregue', value: invoiceStats.delivered, color: '#10B981' },
    { name: 'Pendente', value: invoiceStats.pending, color: '#F59E0B' },
    { name: 'Em Trânsito', value: invoiceStats.inTransit, color: '#3B82F6' }
  ];
  
  return (
    <div className="p-6">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo ao seu painel de controle</p>
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
              <CardDescription>Em Trânsito</CardDescription>
              <CardTitle className="text-2xl flex items-center text-blue-500">
                <AlertCircle className="mr-2 h-5 w-5" />
                {invoiceStats.inTransit}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Em processo de entrega
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardDescription>Entregues</CardDescription>
              <CardTitle className="text-2xl flex items-center text-green-500">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                {invoiceStats.delivered}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Pedidos completos
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Charts */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-muted-foreground" />
                <CardTitle>Status das Notas</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={statusData}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number, name: string) => [`${value} notas`, name]} 
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {statusData.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-3 w-3 rounded-full mr-1" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-sm">{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-muted-foreground" />
                    <CardTitle>Notas Recentes</CardTitle>
                  </div>
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
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">
                      Carregando dados...
                    </div>
                  ) : recentInvoices.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Nenhuma nota fiscal encontrada
                    </div>
                  ) : (
                    recentInvoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center">
                          <div className="mr-4">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium">NF-{invoice.numero_nf}</div>
                            <div className="text-sm text-muted-foreground">
                              {invoice.data_emissao 
                                ? new Date(invoice.data_emissao).toLocaleDateString('pt-BR')
                                : '-'
                              }
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium">
                              R$ {invoice.valor_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '-'}
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              invoice.status_entrega === 'entregue' 
                                ? 'bg-green-100 text-green-800' 
                                : invoice.status_entrega === 'pendente'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}>
                              {invoice.status_entrega === 'entregue' 
                                ? 'Entregue' 
                                : invoice.status_entrega === 'pendente'
                                  ? 'Pendente'
                                  : 'Em Trânsito'
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
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Próximos Vencimentos</CardTitle>
            <CardDescription>Notas a vencer nos próximos dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.slice(0, 3).map((invoice) => (
                <div key={invoice.id} className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-amber-800">
                      {invoice.data_emissao 
                        ? new Date(invoice.data_emissao).toLocaleDateString('pt-BR')
                        : '-'
                      }
                    </div>
                    <div className="text-sm font-bold text-amber-800">EM BREVE</div>
                  </div>
                  <div className="text-sm text-gray-700">
                    NF-{invoice.numero_nf} - R$ {invoice.valor_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '-'}
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button variant="outline" size="sm" className="text-trespharma-teal border-trespharma-teal">
                      Solicitar Pagamento
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
