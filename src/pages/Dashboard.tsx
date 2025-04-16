
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo ao seu painel de controle</p>
        </header>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Notas Fiscais</CardTitle>
              <CardDescription>Gerenciamento de notas fiscais</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Acesse e gerencie todas as suas notas fiscais em um só lugar.</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/invoices">Ver Notas Fiscais</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>Análises e estatísticas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Visualize relatórios detalhados sobre suas transações financeiras.</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/reports">Ver Relatórios</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>Preferências do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Configure as preferências e opções do seu sistema.</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/settings">Configurar</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
