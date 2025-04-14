
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubMenuItem {
  title: string;
  href: string;
}

interface MenuItem {
  title: string;
  icon: LucideIcon;
  href: string;
  items?: SubMenuItem[];
}

interface NavMenuProps {
  items: MenuItem[];
}

export const NavMenu: React.FC<NavMenuProps> = ({ items }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const isGroupActive = (item: MenuItem) => {
    if (isActive(item.href)) return true;
    if (item.items?.some(subItem => isActive(subItem.href))) return true;
    return false;
  };

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = isGroupActive(item);
        const expanded = expandedItems[item.title] || active;

        return (
          <div key={item.title} className="mb-1">
            <div
              className={cn(
                "flex items-center justify-between py-2 px-3 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-700 hover:bg-gray-100",
                item.items ? "cursor-pointer" : ""
              )}
              onClick={item.items ? () => toggleExpand(item.title) : undefined}
            >
              <Link
                to={item.href}
                className={cn("flex items-center flex-1", item.items ? "" : "w-full")}
                onClick={(e) => {
                  if (item.items) e.preventDefault();
                }}
              >
                <item.icon className="h-4 w-4 mr-3" />
                <span>{item.title}</span>
              </Link>
              {item.items && (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expanded ? "transform rotate-180" : ""
                  )}
                />
              )}
            </div>

            {item.items && expanded && (
              <div className="mt-1 ml-5 pl-3 border-l border-gray-200 space-y-1">
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.title}
                    to={subItem.href}
                    className={cn(
                      "flex items-center py-1.5 px-3 rounded-md text-sm transition-colors",
                      isActive(subItem.href)
                        ? "bg-teal-50 text-teal-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
