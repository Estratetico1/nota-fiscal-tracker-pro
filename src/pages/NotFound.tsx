import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Logo from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-teal-50 rounded-full">
            <FileQuestion className="h-16 w-16 text-teal-500" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página não encontrada</p>
        <Button asChild className="bg-teal-500 hover:bg-teal-600">
          <a href="/">Voltar ao Dashboard</a>
        </Button>
        <p className="mt-6 text-sm text-gray-500">
          A página que você está procurando não existe ou foi movida.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
