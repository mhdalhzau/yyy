import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Eye, Undo, DollarSign } from "lucide-react";
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

export default function SalesReturns() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["/api/sales"],
    queryFn: getSales,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
    queryFn: getCustomers,
  });

  // Filter for returns (you can add a status field for returns later)
  const returns = sales.filter((sale: any) => sale.status === "returned");

  const filteredReturns = returns.filter((sale: any) => {
    const customer = customers.find((c: any) => c.id === sale.customerId);
    return customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           sale.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalReturns = returns.reduce((sum: number, sale: any) => sum + parseFloat(sale.total), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading returns...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Retur Penjualan</h1>
          <p className="text-muted-foreground">Kelola retur dan pengembalian barang</p>
        </div>
        <Button className="btn-primary" data-testid="button-add-return">
          <Plus className="w-4 h-4 mr-2" />
          Retur Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Undo className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Retur</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-total-returns">
                  {returns.length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nilai Retur</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-total-return-value">
                  {formatCurrency(totalReturns)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Undo className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Retur Bulan Ini</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-monthly-returns">
                  {returns.length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Retur</CardTitle>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari retur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              data-testid="input-search-returns"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Retur</TableHead>
                <TableHead>ID Penjualan</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Tanggal Retur</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReturns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Undo className="w-12 h-12 text-muted-foreground/50" />
                      <p className="text-muted-foreground">Belum ada data retur</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Retur
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReturns.map((returnItem: any) => {
                  const customer = customers.find((c: any) => c.id === returnItem.customerId);
                  return (
                    <TableRow key={returnItem.id}>
                      <TableCell className="font-medium">{returnItem.id}</TableCell>
                      <TableCell>{returnItem.id}</TableCell>
                      <TableCell>{customer?.name || "Walk-in Customer"}</TableCell>
                      <TableCell>{formatCurrency(returnItem.total)}</TableCell>
                      <TableCell>
                        {new Date(returnItem.createdAt).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning">
                          Returned
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
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
