import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Eye, FileText, DollarSign, Send } from "lucide-react";
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

export default function Invoices() {
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

  const filteredInvoices = sales.filter((sale: any) => {
    const customer = customers.find((c: any) => c.id === sale.customerId);
    const matchesSearch = customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalInvoices = sales.reduce((sum: number, sale: any) => sum + parseFloat(sale.total), 0);
  const paidInvoices = sales.filter((sale: any) => sale.status === "completed");
  const unpaidInvoices = sales.filter((sale: any) => sale.status === "pending");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Invoice</h1>
          <p className="text-muted-foreground">Kelola invoice dan tagihan</p>
        </div>
        <Button className="btn-primary" data-testid="button-create-invoice">
          <Plus className="w-4 h-4 mr-2" />
          Buat Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invoice</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-total-invoices">
                  {sales.length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nilai Invoice</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-invoice-value">
                  {formatCurrency(totalInvoices)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <FileText className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invoice Dibayar</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-paid-invoices">
                  {paidInvoices.length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <FileText className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invoice Belum Dibayar</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-unpaid-invoices">
                  {unpaidInvoices.length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Invoice</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari invoice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-invoices"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
              data-testid="select-status-filter"
            >
              <option value="">Semua Status</option>
              <option value="completed">Dibayar</option>
              <option value="pending">Belum Dibayar</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Invoice</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-12 h-12 text-muted-foreground/50" />
                      <p className="text-muted-foreground">Belum ada invoice</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="w-4 h-4 mr-2" />
                        Buat Invoice
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice: any) => {
                  const customer = customers.find((c: any) => c.id === invoice.customerId);
                  const dueDate = new Date(invoice.createdAt);
                  dueDate.setDate(dueDate.getDate() + 30);

                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">INV-{invoice.id.slice(-8).toUpperCase()}</TableCell>
                      <TableCell>{customer?.name || "Walk-in Customer"}</TableCell>
                      <TableCell>{formatCurrency(invoice.total)}</TableCell>
                      <TableCell>
                        {new Date(invoice.createdAt).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>
                        {dueDate.toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={invoice.status === "completed" ? "default" : invoice.status === "pending" ? "secondary" : "destructive"}
                        >
                          {invoice.status === "completed" ? "Dibayar" : invoice.status === "pending" ? "Belum Dibayar" : "Dibatalkan"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" title="Lihat Invoice">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Kirim Invoice">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
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
