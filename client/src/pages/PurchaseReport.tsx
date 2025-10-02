import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, TrendingDown, DollarSign, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getPurchases, getSuppliers } from "@/lib/api";

const formatCurrency = (amount: string | number) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

export default function PurchaseReport() {
  const [dateRange, setDateRange] = useState("thisMonth");

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ["/api/purchases"],
    queryFn: getPurchases,
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ["/api/suppliers"],
    queryFn: getSuppliers,
  });

  // Calculate statistics
  const totalPurchases = purchases.reduce((sum: number, purchase: any) => sum + parseFloat(purchase.total), 0);
  const completedPurchases = purchases.filter((purchase: any) => purchase.status === "completed");
  const totalCompletedPurchases = completedPurchases.reduce((sum: number, purchase: any) => sum + parseFloat(purchase.total), 0);
  const avgPurchaseValue = purchases.length > 0 ? totalPurchases / purchases.length : 0;

  // Group purchases by date for chart data
  const purchasesByDate = purchases.reduce((acc: any, purchase: any) => {
    const date = new Date(purchase.createdAt).toLocaleDateString("id-ID");
    if (!acc[date]) {
      acc[date] = { date, amount: 0, count: 0 };
    }
    acc[date].amount += parseFloat(purchase.total);
    acc[date].count += 1;
    return acc;
  }, {});

  const chartData = Object.values(purchasesByDate).slice(-7); // Last 7 days

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading purchase report...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Laporan Pembelian</h1>
          <p className="text-muted-foreground">Analisis performa pembelian Anda</p>
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
              <div className="p-3 bg-secondary/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pembelian</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-total-purchases">
                  {formatCurrency(totalPurchases)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingDown className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pembelian Selesai</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-completed-purchases">
                  {formatCurrency(totalCompletedPurchases)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jumlah Transaksi</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-transaction-count">
                  {purchases.length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <TrendingDown className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rata-rata Transaksi</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-average-purchase">
                  {formatCurrency(avgPurchaseValue)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Grafik Pembelian Harian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-around gap-2" data-testid="chart-daily-purchases">
            {chartData.length > 0 ? (
              chartData.map((item: any, index: number) => {
                const maxAmount = Math.max(...chartData.map((d: any) => d.amount));
                const height = (item.amount / maxAmount) * 200;
                return (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1">
                    <div 
                      className="w-full bg-secondary rounded-t" 
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

      {/* Detailed Purchase Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Transaksi Pembelian</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transaksi</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Pajak</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Belum ada transaksi pembelian
                  </TableCell>
                </TableRow>
              ) : (
                purchases.map((purchase: any) => {
                  const supplier = suppliers.find((s: any) => s.id === purchase.supplierId);
                  return (
                    <TableRow key={purchase.id} className="table-row" data-testid={`row-purchase-${purchase.id}`}>
                      <TableCell className="font-mono">{purchase.id.slice(-8)}</TableCell>
                      <TableCell>
                        {supplier ? supplier.name : "Supplier tidak diketahui"}
                      </TableCell>
                      <TableCell>{formatCurrency(purchase.subtotal)}</TableCell>
                      <TableCell>{formatCurrency(purchase.tax || 0)}</TableCell>
                      <TableCell className="font-bold">{formatCurrency(purchase.total)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            purchase.status === "completed" ? "success" :
                            purchase.status === "received" ? "primary" :
                            purchase.status === "pending" ? "warning" : "danger"
                          }
                          data-testid={`badge-status-${purchase.id}`}
                        >
                          {purchase.status === "completed" ? "Selesai" :
                           purchase.status === "received" ? "Diterima" :
                           purchase.status === "pending" ? "Pending" : "Dibatalkan"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(purchase.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {purchase.notes || "-"}
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
