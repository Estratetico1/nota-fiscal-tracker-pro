
import React from "react";
import Logo from "../Logo";
import { NavMenu } from "./NavMenu";
import { FileText, TruckIcon, DollarSign, BarChart2, Settings, CheckSquare } from "lucide-react";

export const Sidebar: React.FC = () => {
  return (
    <div className="h-full w-64 bg-white border-r flex flex-col">
      <div className="px-6 py-5 border-b">
        <Logo />
      </div>
      
      <div className="flex-1 overflow-auto py-4 px-3">
        <NavMenu
          items={[
            { 
              title: "Notas Fiscais", 
              icon: FileText, 
              href: "/", 
              items: [
                { title: "Todas as Notas", href: "/" },
                { title: "Importar Notas", href: "/import" },
              ] 
            },
            { 
              title: "Entregas", 
              icon: TruckIcon, 
              href: "/deliveries", 
              items: [
                { title: "Em andamento", href: "/deliveries" },
                { title: "Concluídas", href: "/deliveries/completed" },
                { title: "Ocorrências", href: "/deliveries/issues" },
              ] 
            },
            { 
              title: "Financeiro", 
              icon: DollarSign, 
              href: "/financial", 
              items: [
                { title: "A Receber", href: "/financial" },
                { title: "Recebidos", href: "/financial/received" },
                { title: "Inadimplentes", href: "/financial/overdue" },
              ] 
            },
            { 
              title: "Relatórios", 
              icon: BarChart2, 
              href: "/reports" 
            },
            { 
              title: "Cadastros", 
              icon: CheckSquare, 
              href: "/registers",
              items: [
                { title: "Clientes", href: "/registers/clients" },
                { title: "Transportadoras", href: "/registers/carriers" },
                { title: "Motoristas", href: "/registers/drivers" },
              ] 
            },
            { 
              title: "Configurações", 
              icon: Settings, 
              href: "/settings" 
            },
          ]}
        />
      </div>
      
      <div className="px-3 py-4 border-t">
        <div className="bg-gray-50 rounded-md p-3 text-sm">
          <div className="font-medium text-gray-900">NFTracker Pro</div>
          <div className="text-gray-500 text-xs mt-1">v1.0.0</div>
        </div>
      </div>
    </div>
  );
};
