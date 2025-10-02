import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Eye, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function Purchases() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ["/api/purchases"],
    queryFn: getPurchases,
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ["/api/suppliers"],
    queryFn: getSuppliers,
  });

  const filteredPurchases = purchases.filter((purchase: any) => {
    const supplier = suppliers.find((s: any) => s.id === purchase.supplierId);
    const matchesSearch = supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || purchase.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPurchases = purchases.reduce((sum: number, purchase: any) => sum + parseFloat(purchase.total), 0);
  const completedPurchases = purchases.filter((purchase: any) => purchase.status === "completed");
  const pendingPurchases = purchases.filter((purchase: any) => purchase.status === "pending");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading purchases...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Pembelian</h1>
          <p className="text-muted-foreground">Kelola transaksi pembelian</p>
        </div>
        <Button className="btn-primary" data-testid="button-add-purchase">
          <Plus className="w-4 h-4 mr-2" />
          Pembelian Baru
        </Button>
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
                  {completedPurchases.length}
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
                <p className="text-sm text-muted-foreground">Pembelian Pending</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-pending-purchases">
                  {pendingPurchases.length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingDown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transaksi</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-total-transactions">
                  {purchases.length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pembelian</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pembelian..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-purchases"
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
              <option value="received">Diterima</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transaksi</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchTerm || statusFilter ? "Tidak ada pembelian yang sesuai filter" : "Belum ada transaksi pembelian"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPurchases.map((purchase: any) => {
                  const supplier = suppliers.find((s: any) => s.id === purchase.supplierId);
                  return (
                    <TableRow key={purchase.id} className="table-row" data-testid={`row-purchase-${purchase.id}`}>
                      <TableCell className="font-mono">{purchase.id.slice(-8)}</TableCell>
                      <TableCell>
                        {supplier ? (
                          <div>
                            <span className="font-semibold">{supplier.name}</span>
                            <p className="text-xs text-muted-foreground">{supplier.contactPerson}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Supplier tidak diketahui</span>
                        )}
                      </TableCell>
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
                        {new Date(purchase.createdAt).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          data-testid={`button-view-${purchase.id}`}
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
