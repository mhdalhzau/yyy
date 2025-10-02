import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardStats, getSales, getPurchases, getExpenses } from "@/lib/api";

const formatCurrency = (amount: string | number) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

export default function ProfitLoss() {
  const [dateRange, setDateRange] = useState("thisMonth");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: getDashboardStats,
  });

  const { data: sales = [], isLoading: salesLoading } = useQuery({
    queryKey: ["/api/sales"],
    queryFn: getSales,
  });

  const { data: purchases = [], isLoading: purchasesLoading } = useQuery({
    queryKey: ["/api/purchases"],
    queryFn: getPurchases,
  });

  const { data: expenses = [], isLoading: expensesLoading } = useQuery({
    queryKey: ["/api/expenses"],
    queryFn: getExpenses,
  });

  // Calculate detailed financial metrics
  const totalRevenue = sales.reduce((sum: number, sale: any) => sum + parseFloat(sale.total), 0);
  const totalCOGS = purchases.reduce((sum: number, purchase: any) => sum + parseFloat(purchase.total), 0);
  const totalExpenses = expenses.reduce((sum: number, expense: any) => sum + parseFloat(expense.amount), 0);
  
  const grossProfit = totalRevenue - totalCOGS;
  const netProfit = grossProfit - totalExpenses;
  const grossProfitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const netProfitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Group data by month for chart
  const monthlyData: Array<{
    month: string;
    revenue: number;
    cogs: number;
    expenses: number;
    profit: number;
  }> = [];
  const currentYear = new Date().getFullYear();
  
  for (let month = 0; month < 12; month++) {
    const monthStart = new Date(currentYear, month, 1);
    const monthEnd = new Date(currentYear, month + 1, 0);
    
    const monthSales = sales.filter((sale: any) => {
      const saleDate = new Date(sale.createdAt);
      return saleDate >= monthStart && saleDate <= monthEnd;
    });
    
    const monthPurchases = purchases.filter((purchase: any) => {
      const purchaseDate = new Date(purchase.createdAt);
      return purchaseDate >= monthStart && purchaseDate <= monthEnd;
    });
    
    const monthExpenses = expenses.filter((expense: any) => {
      const expenseDate = new Date(expense.createdAt);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    });

    const revenue = monthSales.reduce((sum: number, sale: any) => sum + parseFloat(sale.total), 0);
    const cogs = monthPurchases.reduce((sum: number, purchase: any) => sum + parseFloat(purchase.total), 0);
    const expenseAmount = monthExpenses.reduce((sum: number, expense: any) => sum + parseFloat(expense.amount), 0);
    const profit = revenue - cogs - expenseAmount;

    monthlyData.push({
      month: monthStart.toLocaleDateString("id-ID", { month: "short" }),
      revenue,
      cogs,
      expenses: expenseAmount,
      profit
    });
  }

  // Expense breakdown by category
  const expensesByCategory = expenses.reduce((acc: any, expense: any) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += parseFloat(expense.amount);
    return acc;
  }, {});

  const isLoading = statsLoading || salesLoading || purchasesLoading || expensesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading profit & loss report...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Laba & Rugi</h1>
          <p className="text-muted-foreground">Analisis komprehensif kinerja keuangan bisnis</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background"
            data-testid="select-date-range"
          >
            <option value="thisMonth">Bulan Ini</option>
            <option value="lastMonth">Bulan Lalu</option>
            <option value="thisQuarter">Kuartal Ini</option>
            <option value="thisYear">Tahun Ini</option>
            <option value="lastYear">Tahun Lalu</option>
          </select>
          <Button variant="outline" data-testid="button-export-report">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-total-revenue">
                  {formatCurrency(totalRevenue)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Laba Kotor</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-gross-profit">
                  {formatCurrency(grossProfit)}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Margin: {grossProfitMargin.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${netProfit >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                {netProfit >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-success" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-destructive" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Laba Bersih</p>
                <h3 className={`text-2xl font-bold ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`} data-testid="text-net-profit">
                  {formatCurrency(netProfit)}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Margin: {netProfitMargin.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-total-expenses">
                  {formatCurrency(totalExpenses)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Profit & Loss Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Grafik Laba Rugi Bulanan ({currentYear})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-end justify-around gap-1" data-testid="chart-monthly-profit-loss">
            {monthlyData.map((item, index) => {
              const maxValue = Math.max(...monthlyData.map(d => Math.max(d.revenue, Math.abs(d.profit))));
              const revenueHeight = (item.revenue / maxValue) * 280;
              const profitHeight = (Math.abs(item.profit) / maxValue) * 280;
              const isPositiveProfit = item.profit >= 0;
              
              return (
                <div key={index} className="flex flex-col items-center gap-2 flex-1 relative">
                  <div className="flex flex-col items-center gap-1 w-full">
                    {/* Revenue Bar */}
                    <div 
                      className="w-1/3 bg-primary rounded-t opacity-50" 
                      style={{ height: `${revenueHeight}px` }}
                      title={`Pendapatan: ${formatCurrency(item.revenue)}`}
                    ></div>
                    
                    {/* Profit/Loss Bar */}
                    <div 
                      className={`w-1/3 rounded-t ${isPositiveProfit ? 'bg-success' : 'bg-destructive'}`}
                      style={{ height: `${profitHeight}px` }}
                      title={`${isPositiveProfit ? 'Laba' : 'Rugi'}: ${formatCurrency(item.profit)}`}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{item.month}</span>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary opacity-50 rounded"></div>
              <span>Pendapatan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span>Laba</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-destructive rounded"></div>
              <span>Rugi</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed P&L Statement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit & Loss Statement */}
        <Card>
          <CardHeader>
            <CardTitle>Laporan Laba Rugi</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Pendapatan</TableCell>
                  <TableCell className="text-right font-semibold text-primary" data-testid="text-revenue-detail">
                    {formatCurrency(totalRevenue)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-4 text-muted-foreground">Harga Pokok Penjualan (COGS)</TableCell>
                  <TableCell className="text-right text-muted-foreground" data-testid="text-cogs-detail">
                    ({formatCurrency(totalCOGS)})
                  </TableCell>
                </TableRow>
                <TableRow className="border-t">
                  <TableCell className="font-semibold">Laba Kotor</TableCell>
                  <TableCell className={`text-right font-semibold ${grossProfit >= 0 ? 'text-success' : 'text-destructive'}`} data-testid="text-gross-profit-detail">
                    {formatCurrency(grossProfit)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pengeluaran Operasional</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                {Object.entries(expensesByCategory).map(([category, amount]) => (
                  <TableRow key={category}>
                    <TableCell className="pl-4 text-muted-foreground">{category}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      ({formatCurrency(amount as number)})
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="pl-4 font-medium">Total Pengeluaran</TableCell>
                  <TableCell className="text-right font-medium" data-testid="text-total-expenses-detail">
                    ({formatCurrency(totalExpenses)})
                  </TableCell>
                </TableRow>
                <TableRow className="border-t-2 border-foreground">
                  <TableCell className="font-bold text-lg">Laba (Rugi) Bersih</TableCell>
                  <TableCell className={`text-right font-bold text-lg ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`} data-testid="text-net-profit-detail">
                    {formatCurrency(netProfit)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Financial Ratios */}
        <Card>
          <CardHeader>
            <CardTitle>Rasio Keuangan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Margin Profitabilitas</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Margin Laba Kotor</span>
                    <span className="font-semibold" data-testid="text-gross-margin">
                      {grossProfitMargin.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-success h-2 rounded-full" 
                      style={{ width: `${Math.min(grossProfitMargin, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Margin Laba Bersih</span>
                    <span className={`font-semibold ${netProfitMargin >= 0 ? 'text-success' : 'text-destructive'}`} data-testid="text-net-margin">
                      {netProfitMargin.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${netProfitMargin >= 0 ? 'bg-success' : 'bg-destructive'}`}
                      style={{ width: `${Math.min(Math.abs(netProfitMargin), 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Breakdown Pengeluaran</h4>
              <div className="space-y-2">
                {Object.entries(expensesByCategory).map(([category, amount]) => {
                  const percentage = totalExpenses > 0 ? ((amount as number) / totalExpenses) * 100 : 0;
                  return (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm">{category}</span>
                      <span className="text-sm font-medium">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Ringkasan Kinerja</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Return on Sales (ROS):</span>
                  <span className="font-medium">{netProfitMargin.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Rasio Pengeluaran:</span>
                  <span className="font-medium">
                    {totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Break Even Point:</span>
                  <span className="font-medium">
                    {formatCurrency(totalCOGS + totalExpenses)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
