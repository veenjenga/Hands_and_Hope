import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Badge } from './ui/badge';

interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  disabled?: boolean;
  badge?: number;
}

interface CaregiverSidebarProps {
  navigation: NavigationItem[];
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function CaregiverSidebar({ navigation, currentPage, onNavigate }: CaregiverSidebarProps) {
  return (
    <aside className="w-64 bg-blue-900 min-h-screen" aria-label="Caregiver navigation">
      <div className="p-6 border-b border-blue-800 bg-white">
        <h2 className="text-2xl text-blue-900 font-bold">Hands and Hope</h2>
        <p className="text-sm text-gray-600 mt-1">Caregiver Dashboard</p>
      </div>

      <nav className="p-4 space-y-2" role="navigation">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const isDisabled = item.disabled;

          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && onNavigate(item.id)}
              disabled={isDisabled}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white'
                  : isDisabled
                  ? 'text-blue-300 opacity-50 cursor-not-allowed'
                  : 'text-blue-100 hover:bg-blue-800'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              title={item.description}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
