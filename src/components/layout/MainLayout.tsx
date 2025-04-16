
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FileText, BarChart3, Settings, Home, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();
  }, []);
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Notas Fiscais", href: "/invoices", icon: FileText },
    { name: "Relatórios", href: "/reports", icon: BarChart3 },
    { name: "Configurações", href: "/settings", icon: Settings },
  ];
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado do sistema.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: error.message || "Ocorreu um erro ao tentar sair do sistema.",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`w-64 bg-white shadow-md ${mobileMenuOpen ? 'block fixed inset-y-0 left-0 z-50' : 'hidden'} md:block`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <Link to="/" className="flex items-center justify-center">
              <img 
                src="/lovable-uploads/a76fb5b0-ceee-4448-8c62-70e6ccf99d50.png" 
                alt="Três Pharma Logo" 
                className="h-12"
              />
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm rounded-md",
                    isActive
                      ? "bg-trespharma-teal text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-trespharma-teal rounded-full flex items-center justify-center text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.user_metadata?.name || 'Usuário'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center justify-center text-gray-500 hover:text-red-500"
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow fixed top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/a76fb5b0-ceee-4448-8c62-70e6ccf99d50.png" 
            alt="Três Pharma Logo" 
            className="h-8"
          />
        </Link>
        <div>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="focus:outline-none"
          >
            <svg
              className="h-6 w-6 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="md:pt-0 pt-16 pb-16 md:pb-0">
          {children}
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center p-2 text-xs",
                  isActive
                    ? "text-trespharma-teal"
                    : "text-gray-600"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
