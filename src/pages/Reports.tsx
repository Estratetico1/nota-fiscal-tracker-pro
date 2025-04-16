
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data for the reports
const monthlyData = [
  { month: "Jan", paid: 25000, pending: 5000, overdue: 1000 },
  { month: "Fev", paid: 30000, pending: 8000, overdue: 2000 },
  { month: "Mar", paid: 28000, pending: 12000, overdue: 3000 },
  { month: "Abr", paid: 32000, pending: 10000, overdue: 4000 },
  { month: "Mai", paid: 35000, pending: 9000, overdue: 2500 },
  { month: "Jun", paid: 31000, pending: 7500, overdue: 1800 },
];

const invoiceTypeData = [
  { name: "NF-e", value: 65 },
  { name: "NFS-e", value: 25 },
  { name: "NFC-e", value: 10 },
];

const Reports = () => {
  return (
    <div className="p-6">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Relatórios</h1>
          <p className="text-gray-600">Visualize relatórios e análises financeiras</p>
        </header>
        
        <div className="flex items-center justify-end mb-6">
          <div className="flex items-center gap-4">
            <Select defaultValue="2023">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="q1">1º Trimestre</SelectItem>
                <SelectItem value="q2">2º Trimestre</SelectItem>
                <SelectItem value="q3">3º Trimestre</SelectItem>
                <SelectItem value="q4">4º Trimestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
              <CardDescription>Total mensal de notas fiscais por status</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ paid: { label: "Pagas", color: "#22c55e" }, pending: { label: "Pendentes", color: "#f59e0b" }, overdue: { label: "Vencidas", color: "#ef4444" } }} className="h-80">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="paid" name="Pagas" fill="#22c55e" />
                  <Bar dataKey="pending" name="Pendentes" fill="#f59e0b" />
                  <Bar dataKey="overdue" name="Vencidas" fill="#ef4444" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Faturamento</CardTitle>
              <CardDescription>Evolução do faturamento ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ total: { label: "Total", color: "#008599" } }} className="h-80">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="paid" 
                    name="Total Faturado" 
                    stroke="#008599" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Distribuição por Tipo</CardTitle>
              <CardDescription>Quantidade de notas por tipo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoiceTypeData.map((item) => (
                  <div key={item.name} className="flex items-center">
                    <div className="w-16">{item.name}</div>
                    <div className="flex-1 mx-2">
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            item.name === "NF-e" 
                              ? "bg-trespharma-teal" 
                              : item.name === "NFS-e" 
                                ? "bg-trespharma-orange" 
                                : "bg-blue-400"
                          }`}
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right w-12">{item.value}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
              <CardDescription>Visão geral dos valores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Total Emitido</div>
                  <div className="text-xl font-bold text-gray-800">R$ 181.000,00</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Total Pago</div>
                  <div className="text-xl font-bold text-green-600">R$ 151.000,00</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Pendente</div>
                  <div className="text-xl font-bold text-amber-600">R$ 21.500,00</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Vencido</div>
                  <div className="text-xl font-bold text-red-600">R$ 8.500,00</div>
                </div>
              </div>
              
              <div className="mt-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-4 text-left border-b">Mês</th>
                      <th className="py-2 px-4 text-right border-b">Quantidade</th>
                      <th className="py-2 px-4 text-right border-b">Valor Total</th>
                      <th className="py-2 px-4 text-right border-b">Valor Pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((item) => (
                      <tr key={item.month} className="border-b">
                        <td className="py-2 px-4">{item.month}/2023</td>
                        <td className="py-2 px-4 text-right">
                          {Math.round((item.paid + item.pending + item.overdue) / 1000)}
                        </td>
                        <td className="py-2 px-4 text-right">
                          R$ {(item.paid + item.pending + item.overdue).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-2 px-4 text-right">
                          R$ {item.paid.toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
