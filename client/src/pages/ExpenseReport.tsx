import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Wallet, TrendingUp, DollarSign, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getExpenses } from "@/lib/api";

const formatCurrency = (amount: string | number) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

export default function ExpenseReport() {
  const [dateRange, setDateRange] = useState("thisMonth");
  const [categoryFilter, setCategoryFilter] = useState("");

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["/api/expenses"],
    queryFn: getExpenses,
  });

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum: number, expense: any) => sum + parseFloat(expense.amount), 0);
  const approvedExpenses = expenses.filter((expense: any) => expense.status === "approved");
  const totalApprovedExpenses = approvedExpenses.reduce((sum: number, expense: any) => sum + parseFloat(expense.amount), 0);
  const pendingExpenses = expenses.filter((expense: any) => expense.status === "pending");

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc: any, expense: any) => {
    if (!acc[expense.category]) {
      acc[expense.category] = { category: expense.category, amount: 0, count: 0 };
    }
    acc[expense.category].amount += parseFloat(expense.amount);
    acc[expense.category].count += 1;
    return acc;
  }, {});

  const categoryData = Object.values(expensesByCategory);
  const categories = Array.from(new Set(expenses.map((expense: any) => expense.category)));

  // Group expenses by date for chart data
  const expensesByDate = expenses.reduce((acc: any, expense: any) => {
    const date = new Date(expense.createdAt).toLocaleDateString("id-ID");
    if (!acc[date]) {
      acc[date] = { date, amount: 0, count: 0 };
    }
    acc[date].amount += parseFloat(expense.amount);
    acc[date].count += 1;
    return acc;
  }, {});

  const chartData = Object.values(expensesByDate).slice(-7); // Last 7 days

  const filteredExpenses = expenses.filter((expense: any) => {
    return !categoryFilter || expense.category === categoryFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading expense report...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Laporan Pengeluaran</h1>
          <p className="text-muted-foreground">Analisis pengeluaran bisnis Anda</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background"
            data-testid="select-date-range"
          >
            <option value="today">Hari Ini</option>
            <option value="thisWeek">Minggu Ini</option>
            <option value="thisMonth">Bulan Ini</option>
            <option value="lastMonth">Bulan Lalu</option>
            <option value="thisYear">Tahun Ini</option>
          </select>
          <Button variant="outline" data-testid="button-export-report">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Wallet className="w-6 h-6 text-warning" />
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

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pengeluaran Disetujui</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-approved-expenses">
                  {formatCurrency(totalApprovedExpenses)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jumlah Transaksi</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-transaction-count">
                  {expenses.length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <PieChart className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-pending-expenses">
                  {pendingExpenses.length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Expenses Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Grafik Pengeluaran Harian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-around gap-2" data-testid="chart-daily-expenses">
              {chartData.length > 0 ? (
                chartData.map((item: any, index: number) => {
                  const maxAmount = Math.max(...chartData.map((d: any) => d.amount));
                  const height = (item.amount / maxAmount) * 200;
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                      <div 
                        className="w-full bg-warning rounded-t" 
                        style={{ height: `${height}px` }}
                        title={`${item.date}: ${formatCurrency(item.amount)} (${item.count} transaksi)`}
                      ></div>
                      <span className="text-xs text-muted-foreground text-center">
                        {item.date.split('/').slice(0, 2).join('/')}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Tidak ada data untuk ditampilkan
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expenses by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Pengeluaran per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.length > 0 ? (
                categoryData.map((item: any, index: number) => {
                  const percentage = ((item.amount / totalExpenses) * 100).toFixed(1);
                  const colors = ['bg-primary', 'bg-secondary', 'bg-success', 'bg-warning', 'bg-destructive'];
                  const color = colors[index % colors.length];
                  
                  return (
                    <div key={item.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(item.amount)} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${color}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Tidak ada data kategori
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Pengeluaran</CardTitle>
          <div className="flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
              data-testid="select-category-filter"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={String(category)} value={String(category)}>
                  {String(category)}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Deskripsi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {categoryFilter ? "Tidak ada pengeluaran dalam kategori ini" : "Belum ada pengeluaran"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense: any) => (
                  <TableRow key={expense.id} className="table-row" data-testid={`row-expense-${expense.id}`}>
                    <TableCell className="font-semibold">{expense.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{expense.category}</Badge>
                    </TableCell>
                    <TableCell className="font-bold">{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          expense.status === "approved" ? "success" :
                          expense.status === "pending" ? "warning" : "danger"
                        }
                        data-testid={`badge-status-${expense.id}`}
                      >
                        {expense.status === "approved" ? "Disetujui" :
                         expense.status === "pending" ? "Pending" : "Ditolak"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(expense.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {expense.description || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
