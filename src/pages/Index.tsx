
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, BarChart3, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-10 text-center">
          <img 
            src="/lovable-uploads/a76fb5b0-ceee-4448-8c62-70e6ccf99d50.png" 
            alt="Três Pharma Logo" 
            className="h-20 mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold mb-2 text-trespharma-teal">Portal do Cliente</h1>
          <p className="text-xl text-gray-600">Gerencie suas notas fiscais de forma simples e eficiente</p>
        </header>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-t-4 border-t-trespharma-teal">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-6 w-6 text-trespharma-teal" />
                Notas Fiscais
              </CardTitle>
              <CardDescription>Acesse todas as suas notas fiscais em um só lugar</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Visualize, organize e pesquise todas as suas notas fiscais com facilidade.
                Acompanhe status de pagamento, vencimentos e faça download dos arquivos.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full border-trespharma-teal text-trespharma-teal hover:bg-trespharma-teal hover:text-white">
                <Link to="/invoices">Acessar Notas Fiscais</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-t-4 border-t-trespharma-orange">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-6 w-6 text-trespharma-orange" />
                Relatórios
              </CardTitle>
              <CardDescription>Visualize análises e relatórios financeiros</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Acompanhe seus gastos, receitas e obtenha insights sobre suas finanças 
                com relatórios detalhados e gráficos intuitivos.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full border-trespharma-orange text-trespharma-orange hover:bg-trespharma-orange hover:text-white">
                <Link to="/reports">Ver Relatórios</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">
            Já possui uma conta no portal de clientes?
          </p>
          <Button asChild size="lg" className="bg-trespharma-teal hover:bg-trespharma-teal/90">
            <Link to="/login" className="flex items-center">
              Acessar Portal <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
