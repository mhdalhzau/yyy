import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Eye, TrendingUp, DollarSign } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function Sales() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["/api/sales"],
    queryFn: getSales,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
    queryFn: getCustomers,
  });

  const filteredSales = sales.filter((sale: any) => {
    const customer = customers.find((c: any) => c.id === sale.customerId);
    const matchesSearch = customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSales = sales.reduce((sum: number, sale: any) => sum + parseFloat(sale.total), 0);
  const completedSales = sales.filter((sale: any) => sale.status === "completed");
  const pendingSales = sales.filter((sale: any) => sale.status === "pending");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading sales...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Penjualan</h1>
          <p className="text-muted-foreground">Kelola transaksi penjualan</p>
        </div>
        <Button className="btn-primary" data-testid="button-add-sale">
          <Plus className="w-4 h-4 mr-2" />
          Transaksi Baru
        </Button>
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
                <p className="text-sm text-muted-foreground">Transaksi Selesai</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-completed-sales">
                  {completedSales.length}
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
                <p className="text-sm text-muted-foreground">Transaksi Pending</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-pending-sales">
                  {pendingSales.length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transaksi</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-total-transactions">
                  {sales.length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Penjualan</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari penjualan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-sales"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
              data-testid="select-status-filter"
            >
              <option value="">Semua Status</option>
              <option value="completed">Selesai</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transaksi</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Metode Pembayaran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm || statusFilter ? "Tidak ada penjualan yang sesuai filter" : "Belum ada transaksi penjualan"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map((sale: any) => {
                  const customer = customers.find((c: any) => c.id === sale.customerId);
                  return (
                    <TableRow key={sale.id} className="table-row" data-testid={`row-sale-${sale.id}`}>
                      <TableCell className="font-mono">{sale.id.slice(-8)}</TableCell>
                      <TableCell>
                        {customer ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={customer.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"}
                              alt={customer.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="font-semibold">{customer.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Walk-in Customer</span>
                        )}
                      </TableCell>
                      <TableCell className="font-bold">{formatCurrency(sale.total)}</TableCell>
                      <TableCell className="capitalize">{sale.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            sale.status === "completed" ? "default" :
                            sale.status === "pending" ? "secondary" : "destructive"
                          }
                          data-testid={`badge-status-${sale.id}`}
                        >
                          {sale.status === "completed" ? "Selesai" :
                           sale.status === "pending" ? "Pending" : "Dibatalkan"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(sale.createdAt).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          data-testid={`button-view-${sale.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
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
