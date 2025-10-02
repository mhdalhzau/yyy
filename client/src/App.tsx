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
import Purchases from "@/pages/Purchases";
import Customers from "@/pages/Customers";
import Suppliers from "@/pages/Suppliers";
import SalesReport from "@/pages/SalesReport";
import PurchaseReport from "@/pages/PurchaseReport";
import ExpenseReport from "@/pages/ExpenseReport";
import ProfitLoss from "@/pages/ProfitLoss";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/products" component={Products} />
        <Route path="/products/add" component={AddProduct} />
        <Route path="/categories" component={Categories} />
        <Route path="/low-stock" component={LowStock} />
        <Route path="/sales" component={Sales} />
        <Route path="/purchases" component={Purchases} />
        <Route path="/customers" component={Customers} />
        <Route path="/suppliers" component={Suppliers} />
        <Route path="/reports/sales" component={SalesReport} />
        <Route path="/reports/purchases" component={PurchaseReport} />
        <Route path="/reports/expenses" component={ExpenseReport} />
        <Route path="/reports/profit-loss" component={ProfitLoss} />
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
