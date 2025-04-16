
import { Link, useLocation } from "react-router-dom";
import { FileText, BarChart3, Settings, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Notas Fiscais", href: "/invoices", icon: FileText },
    { name: "Relatórios", href: "/reports", icon: BarChart3 },
    { name: "Configurações", href: "/settings", icon: Settings },
  ];
  
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <Link to="/" className="flex items-center justify-center">
              <img 
                src="/lovable-uploads/a76fb5b0-ceee-4448-8c62-70e6ccf99d50.png" 
                alt="Três Pharma Logo" 
                className="h-12"
              />
            </Link>
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
            <div className="flex items-center">
              <div className="h-8 w-8 bg-trespharma-teal rounded-full flex items-center justify-center text-white">
                U
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Usuário</p>
                <p className="text-xs text-gray-500">user@trespharma.com</p>
              </div>
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
          <button className="focus:outline-none">
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
        <div className="md:pt-0 pt-16">
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
