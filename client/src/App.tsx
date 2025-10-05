import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import AddProduct from "@/pages/AddProduct";
import Categories from "@/pages/Categories";
import LowStock from "@/pages/LowStock";
import Sales from "@/pages/Sales";
import SalesReturns from "@/pages/SalesReturns";
import Invoices from "@/pages/Invoices";
import Purchases from "@/pages/Purchases";
import Customers from "@/pages/Customers";
import Suppliers from "@/pages/Suppliers";
import SalesReport from "@/pages/SalesReport";
import PurchaseReport from "@/pages/PurchaseReport";
import ExpenseReport from "@/pages/ExpenseReport";
import ProfitLoss from "@/pages/ProfitLoss";
import Settings from "@/pages/Settings";
import POS from "@/pages/POS";
import NotFound from "@/pages/not-found";
import Brands from "@/pages/Brands";
import Units from "@/pages/Units";
import SubCategories from "@/pages/SubCategories";
import VariantAttributes from "@/pages/VariantAttributes";
import Warranties from "@/pages/Warranties";
import ExpiredProducts from "@/pages/ExpiredProducts";
import PrintBarcode from "@/pages/PrintBarcode";
import PrintQRCode from "@/pages/PrintQRCode";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        
        {/* Inventory */}
        <Route path="/products" component={Products} />
        <Route path="/products/add" component={AddProduct} />
        <Route path="/products/expired" component={ExpiredProducts} />
        <Route path="/categories" component={Categories} />
        <Route path="/sub-categories" component={SubCategories} />
        <Route path="/brands" component={Brands} />
        <Route path="/units" component={Units} />
        <Route path="/variant-attributes" component={VariantAttributes} />
        <Route path="/warranties" component={Warranties} />
        <Route path="/print-barcode" component={PrintBarcode} />
        <Route path="/print-qr-code" component={PrintQRCode} />
        <Route path="/low-stock" component={LowStock} />
        
        {/* Sales */}
        <Route path="/pos" component={POS} />
        <Route path="/sales" component={Sales} />
        <Route path="/sales/returns" component={SalesReturns} />
        <Route path="/invoices" component={Invoices} />
        
        {/* Purchase */}
        <Route path="/purchases" component={Purchases} />
        
        {/* People */}
        <Route path="/customers" component={Customers} />
        <Route path="/suppliers" component={Suppliers} />
        
        {/* Reports */}
        <Route path="/reports/sales" component={SalesReport} />
        <Route path="/reports/purchases" component={PurchaseReport} />
        <Route path="/reports/expenses" component={ExpenseReport} />
        <Route path="/reports/profit-loss" component={ProfitLoss} />
        
        {/* Settings */}
        <Route path="/settings" component={Settings} />
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
