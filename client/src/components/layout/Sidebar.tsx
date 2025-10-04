import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, Box, Plus, Tag, AlertTriangle, ShoppingCart, 
  ShoppingBag, Undo, FileText, Users, Truck, 
  TrendingUp, BarChart3, Wallet, DollarSign, Settings,
  X, Monitor, ChevronDown, ChevronRight, Package,
  Archive, Clock, Layers, FolderTree, Award, Zap,
  Shield, Barcode, QrCode, PackageCheck, GitBranch,
  RefreshCw, Clipboard, FileStack
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

interface NavCategory {
  category: string;
  icon?: any;
  items: NavItem[];
}

type NavigationItem = NavItem | NavCategory;

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/", icon: Home },
  {
    category: "Inventory",
    icon: Package,
    items: [
      { name: "Products", href: "/products", icon: Box },
      { name: "Create Product", href: "/products/add", icon: Plus },
      { name: "Expired Products", href: "/products/expired", icon: Clock },
      { name: "Low Stocks", href: "/low-stock", icon: AlertTriangle },
      { name: "Category", href: "/categories", icon: Tag },
      { name: "Sub Category", href: "/sub-categories", icon: FolderTree },
      { name: "Brands", href: "/brands", icon: Award },
      { name: "Units", href: "/units", icon: Zap },
      { name: "Variant Attributes", href: "/variant-attributes", icon: Layers },
      { name: "Warranties", href: "/warranties", icon: Shield },
      { name: "Print Barcode", href: "/print-barcode", icon: Barcode },
      { name: "Print QR Code", href: "/print-qr-code", icon: QrCode },
    ]
  },
  {
    category: "Stock",
    icon: Archive,
    items: [
      { name: "Manage Stock", href: "/stock/manage", icon: PackageCheck },
      { name: "Stock Adjustment", href: "/stock/adjustment", icon: RefreshCw },
      { name: "Stock Transfer", href: "/stock/transfer", icon: GitBranch },
    ]
  },
  {
    category: "Sales",
    icon: ShoppingCart,
    items: [
      { name: "POS", href: "/pos", icon: Monitor },
      { name: "Sales", href: "/sales", icon: ShoppingCart },
      { name: "Invoices", href: "/invoices", icon: FileText },
      { name: "Sales Return", href: "/sales/returns", icon: Undo },
    ]
  },
  {
    category: "Purchase",
    icon: ShoppingBag,
    items: [
      { name: "Purchases", href: "/purchases", icon: ShoppingBag },
      { name: "Purchase Order", href: "/purchases/orders", icon: Clipboard },
      { name: "Purchase Return", href: "/purchases/returns", icon: Undo },
    ]
  },
  {
    category: "People",
    icon: Users,
    items: [
      { name: "Customers", href: "/customers", icon: Users },
      { name: "Suppliers", href: "/suppliers", icon: Truck },
    ]
  },
  {
    category: "Reports",
    icon: BarChart3,
    items: [
      { name: "Sales Report", href: "/reports/sales", icon: TrendingUp },
      { name: "Purchase Report", href: "/reports/purchases", icon: BarChart3 },
      { name: "Expense Report", href: "/reports/expenses", icon: Wallet },
      { name: "Profit & Loss", href: "/reports/profit-loss", icon: DollarSign },
      { name: "Stock Report", href: "/reports/stock", icon: FileStack },
    ]
  },
  {
    category: "Settings",
    icon: Settings,
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
    ]
  }
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(() => {
    const initialExpanded: string[] = [];
    navigation.forEach((item) => {
      if ('category' in item) {
        const hasActiveItem = item.items.some(subItem => 
          subItem.href === "/" ? location === "/" : location.startsWith(subItem.href)
        );
        if (hasActiveItem) {
          initialExpanded.push(item.category);
        }
      }
    });
    return initialExpanded;
  });

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
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
            } else if ('category' in item) {
              const isExpanded = expandedCategories.includes(item.category);
              const CategoryIcon = item.icon;
              
              return (
                <div key={index} className="mb-2">
                  <button
                    onClick={() => toggleCategory(item.category)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-left transition-colors hover:bg-white/10",
                      isExpanded && "bg-white/5"
                    )}
                    data-testid={`nav-category-${item.category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center gap-3">
                      {CategoryIcon && <CategoryIcon className="w-5 h-5" />}
                      <span className="font-medium">{item.category}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="ml-4 mt-1">
                      {item.items?.map((subItem) => {
                        const Icon = subItem.icon;
                        return (
                          <Link key={subItem.name} href={subItem.href}>
                            <button 
                              className={cn(
                                "sidebar-nav-item w-full flex items-center gap-3 px-4 py-2 rounded-lg mb-1 text-left transition-colors text-sm",
                                isActive(subItem.href) ? "active bg-primary text-white" : "hover:bg-white/10"
                              )}
                              data-testid={`nav-${subItem.name.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{subItem.name}</span>
                            </button>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </nav>
      </aside>
    </>
  );
}
