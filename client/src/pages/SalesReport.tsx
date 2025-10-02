import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Download, TrendingUp, DollarSign, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getSales, getCustomers } from "@/lib/api";

const formatCurrency = (amount: string | number) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

export default function SalesReport() {
  const [dateRange, setDateRange] = useState("thisMonth");

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["/api/sales"],
    queryFn: getSales,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
    queryFn: getCustomers,
  });

  // Calculate statistics
  const totalSales = sales.reduce((sum: number, sale: any) => sum + parseFloat(sale.total), 0);
  const completedSales = sales.filter((sale: any) => sale.status === "completed");
  const totalCompletedSales = completedSales.reduce((sum: number, sale: any) => sum + parseFloat(sale.total), 0);
  const avgSaleValue = sales.length > 0 ? totalSales / sales.length : 0;

  // Group sales by date for chart data
  const salesByDate = sales.reduce((acc: any, sale: any) => {
    const date = new Date(sale.createdAt).toLocaleDateString("id-ID");
    if (!acc[date]) {
      acc[date] = { date, amount: 0, count: 0 };
    }
    acc[date].amount += parseFloat(sale.total);
    acc[date].count += 1;
    return acc;
  }, {});

  const chartData = Object.values(salesByDate).slice(-7); // Last 7 days

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading sales report...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Laporan Penjualan</h1>
          <p className="text-muted-foreground">Analisis performa penjualan Anda</p>
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
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Penjualan</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-total-sales">
                  {formatCurrency(totalSales)}
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
                <p className="text-sm text-muted-foreground">Penjualan Selesai</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-completed-sales">
                  {formatCurrency(totalCompletedSales)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jumlah Transaksi</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-transaction-count">
                  {sales.length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rata-rata Transaksi</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-average-sale">
                  {formatCurrency(avgSaleValue)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Grafik Penjualan Harian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-around gap-2" data-testid="chart-daily-sales">
            {chartData.length > 0 ? (
              chartData.map((item: any, index: number) => {
                const maxAmount = Math.max(...chartData.map((d: any) => d.amount));
                const height = (item.amount / maxAmount) * 200;
                return (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1">
                    <div 
                      className="w-full bg-primary rounded-t" 
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

      {/* Detailed Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Transaksi Penjualan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transaksi</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Pajak</TableHead>
                <TableHead>Diskon</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Pembayaran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Belum ada transaksi penjualan
                  </TableCell>
                </TableRow>
              ) : (
                sales.map((sale: any) => {
                  const customer = customers.find((c: any) => c.id === sale.customerId);
                  return (
                    <TableRow key={sale.id} className="table-row" data-testid={`row-sale-${sale.id}`}>
                      <TableCell className="font-mono">{sale.id.slice(-8)}</TableCell>
                      <TableCell>
                        {customer ? customer.name : "Walk-in Customer"}
                      </TableCell>
                      <TableCell>{formatCurrency(sale.subtotal)}</TableCell>
                      <TableCell>{formatCurrency(sale.tax || 0)}</TableCell>
                      <TableCell>{formatCurrency(sale.discount || 0)}</TableCell>
                      <TableCell className="font-bold">{formatCurrency(sale.total)}</TableCell>
                      <TableCell className="capitalize">{sale.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            sale.status === "completed" ? "success" :
                            sale.status === "pending" ? "warning" : "danger"
                          }
                          data-testid={`badge-status-${sale.id}`}
                        >
                          {sale.status === "completed" ? "Selesai" :
                           sale.status === "pending" ? "Pending" : "Dibatalkan"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(sale.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
