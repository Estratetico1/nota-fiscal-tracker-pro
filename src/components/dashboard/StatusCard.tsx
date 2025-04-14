
import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'teal' | 'orange' | 'gray';
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon,
  trend,
  variant = 'default'
}) => {
  const variants = {
    default: 'bg-white',
    teal: 'bg-teal-50 border-teal-100',
    orange: 'bg-orange-50 border-orange-100',
    gray: 'bg-gray-50 border-gray-100'
  };
  
  return (
    <Card className={cn("border", variants[variant])}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h4 className="text-2xl font-bold mt-1">{value}</h4>
            
            {trend && (
              <div className="flex items-center mt-2">
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {trend.isPositive ? "+" : "-"}{trend.value}%
                </span>
                <span className="text-xs text-gray-500 ml-1">do último mês</span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "p-3 rounded-md",
            variant === 'teal' ? "bg-teal-100 text-teal-700" :
            variant === 'orange' ? "bg-orange-100 text-orange-700" :
            "bg-gray-100 text-gray-700"
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
