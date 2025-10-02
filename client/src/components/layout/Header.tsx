import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
            data-testid="button-menu-toggle"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground" data-testid="text-welcome">Selamat Datang, Admin</h2>
            <p className="text-sm text-muted-foreground">
              Anda memiliki <span className="font-semibold text-warning" data-testid="text-order-count">200+ Order</span> Hari Ini
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            data-testid="button-notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
              alt="Admin Profile" 
              className="w-10 h-10 rounded-full object-cover"
              data-testid="img-admin-avatar"
            />
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-foreground" data-testid="text-admin-name">Admin User</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
