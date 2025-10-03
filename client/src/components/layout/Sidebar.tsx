import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, Box, Plus, Tag, AlertTriangle, ShoppingCart, 
  ShoppingBag, Undo, FileText, Users, Truck, 
  TrendingUp, BarChart3, Wallet, DollarSign, Settings,
  X, Monitor
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  {
    category: "Produk",
    items: [
      { name: "Produk", href: "/products", icon: Box },
      { name: "Tambah Produk", href: "/products/add", icon: Plus },
      { name: "Kategori", href: "/categories", icon: Tag },
      { name: "Stok Rendah", href: "/low-stock", icon: AlertTriangle },
    ]
  },
  {
    category: "Transaksi", 
    items: [
      { name: "POS", href: "/pos", icon: Monitor },
      { name: "Penjualan", href: "/sales", icon: ShoppingCart },
      { name: "Pembelian", href: "/purchases", icon: ShoppingBag },
      { name: "Retur Penjualan", href: "/sales/returns", icon: Undo },
      { name: "Invoice", href: "/invoices", icon: FileText },
    ]
  },
  {
    category: "Manajemen",
    items: [
      { name: "Pelanggan", href: "/customers", icon: Users },
      { name: "Supplier", href: "/suppliers", icon: Truck },
    ]
  },
  {
    category: "Laporan",
    items: [
      { name: "Laporan Penjualan", href: "/reports/sales", icon: TrendingUp },
      { name: "Laporan Pembelian", href: "/reports/purchases", icon: BarChart3 },
      { name: "Laporan Pengeluaran", href: "/reports/expenses", icon: Wallet },
      { name: "Laba & Rugi", href: "/reports/profit-loss", icon: DollarSign },
    ]
  },
  {
    category: "Pengaturan",
    items: [
      { name: "Pengaturan", href: "/settings", icon: Settings },
    ]
  }
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground overflow-y-auto z-50 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary" data-testid="logo-title">DreamsPOS</h1>
              <p className="text-xs text-sidebar-foreground/60 mt-1">Point of Sale System</p>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden text-sidebar-foreground hover:text-primary"
              data-testid="button-close-sidebar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <nav className="p-4">
          {navigation.map((item, index) => {
            if ('href' in item && item.href && item.icon) {
              // Single navigation item
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <button 
                    className={cn(
                      "sidebar-nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-left transition-colors",
                      isActive(item.href) ? "active bg-primary" : "hover:bg-white/10"
                    )}
                    data-testid={`nav-${item.name?.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                </Link>
              );
            } else {
              // Category with items
              return (
                <div key={index}>
                  <div className="mt-6 mb-2 px-4 text-xs text-sidebar-foreground/40 uppercase tracking-wider font-semibold">
                    {item.category}
                  </div>
                  {item.items?.map((subItem) => {
                    const Icon = subItem.icon;
                    return (
                      <Link key={subItem.name} href={subItem.href}>
                        <button 
                          className={cn(
                            "sidebar-nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-left transition-colors",
                            isActive(subItem.href) ? "active bg-primary" : "hover:bg-white/10"
                          )}
                          data-testid={`nav-${subItem.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{subItem.name}</span>
                        </button>
                      </Link>
                    );
                  })}
                </div>
              );
            }
          })}
        </nav>
      </aside>
    </>
  );
}
