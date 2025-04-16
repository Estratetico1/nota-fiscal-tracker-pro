
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-primary">Nota Fiscal Tracker Pro</h1>
          <p className="text-xl text-gray-600">Gerencie suas notas fiscais de forma simples e eficiente</p>
        </header>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Notas Fiscais</CardTitle>
              <CardDescription>Gerencie todas as suas notas fiscais em um só lugar</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Visualize, organize e pesquise todas as suas notas fiscais com facilidade.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/invoices">Acessar Notas Fiscais</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>Visualize análises e relatórios financeiros</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Acompanhe seus gastos, receitas e análises fiscais em tempo real.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/reports">Ver Relatórios</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">
            Comece agora mesmo a organizar suas finanças!
          </p>
          <Button size="lg" variant="default" asChild>
            <Link to="/dashboard">Acessar Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
