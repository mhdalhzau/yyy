import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, DollarSign, ShoppingCart, TrendingUp, FileText } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import SalesChart from "@/components/charts/SalesChart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  getDashboardStats, 
  getTopSellingProducts, 
  getLowStockProducts, 
  getTopCustomers,
  getRecentSales 
} from "@/lib/api";

const formatCurrency = (amount: string | number) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: getDashboardStats,
  });

  const { data: topProducts } = useQuery({
    queryKey: ["/api/products/top-selling"],
    queryFn: () => getTopSellingProducts(5),
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ["/api/products/low-stock"],
    queryFn: getLowStockProducts,
  });

  const { data: topCustomers } = useQuery({
    queryKey: ["/api/customers/top"],
    queryFn: () => getTopCustomers(5),
  });

  const { data: recentSales } = useQuery({
    queryKey: ["/api/sales/recent"],
    queryFn: () => getRecentSales(5),
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      <div className="px-6 pt-6">
        <Alert className="bg-warning/10 border-warning" data-testid="alert-low-stock">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning-foreground">
            Produk Anda <span className="font-bold">Apple iPhone 15</span> stok hampir habis, sudah di bawah 5 pcs. 
            <Button variant="link" className="text-primary font-semibold p-0 ml-1 h-auto" data-testid="link-add-stock">
              Tambah Stok
            </Button>
          </AlertDescription>
        </Alert>
      </div>

      {/* Statistics Cards */}
      <div className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Penjualan"
            value={formatCurrency(stats?.totalSales || "0")}
            icon={DollarSign}
            change="+22%"
            changeType="positive"
            iconBgColor="bg-primary/10"
          />
          <StatCard
            title="Total Pembelian"
            value={formatCurrency(stats?.totalPurchases || "0")}
            icon={ShoppingCart}
            change="+22%"
            changeType="positive"
            iconBgColor="bg-secondary/10"
          />
          <StatCard
            title="Profit"
            value={formatCurrency(stats?.totalProfit || "0")}
            icon={TrendingUp}
            change="+35%"
            changeType="positive"
            iconBgColor="bg-success/10"
          />
          <StatCard
            title="Invoice Jatuh Tempo"
            value={formatCurrency("48988078")}
            icon={FileText}
            change="+35%"
            changeType="positive"
            iconBgColor="bg-warning/10"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SalesChart />
          
          {/* Overall Information */}
          <Card data-testid="card-overall-info">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Informasi Keseluruhan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="text-primary w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Supplier</span>
                </div>
                <span className="text-xl font-bold text-foreground" data-testid="text-supplier-count">
                  {stats?.totalSuppliers || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <ShoppingCart className="text-secondary w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Pelanggan</span>
                </div>
                <span className="text-xl font-bold text-foreground" data-testid="text-customer-count">
                  {stats?.totalCustomers || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <DollarSign className="text-success w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Order</span>
                </div>
                <span className="text-xl font-bold text-foreground" data-testid="text-order-count">
                  {stats?.totalOrders || 0}
                </span>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                <h4 className="text-sm font-semibold text-foreground mb-2">Ringkasan Pelanggan</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Pelanggan Pertama</span>
                      <span className="text-lg font-bold text-foreground">5.5K</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">25%</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Pelanggan Kembali</span>
                      <span className="text-lg font-bold text-foreground">3.5K</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: "21%" }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">21%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Products and Sales Section */}
      <div className="px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Products */}
          <Card data-testid="card-top-products">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">Produk Terlaris</CardTitle>
                <select className="px-3 py-1.5 text-sm border border-border rounded-md bg-background" data-testid="select-top-products-period">
                  <option>Hari Ini</option>
                  <option>Minggu Ini</option>
                  <option>Bulan Ini</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!topProducts || topProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Belum ada data produk terlaris
                </div>
              ) : (
                topProducts.map((product: any) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors" data-testid={`product-${product.id}`}>
                    <img 
                      src={product.imageUrl || "https://images.unsplash.com/photo-1625948515291-69613efd103f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
                      alt={product.name} 
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-foreground mb-1">{product.name}</h4>
                      <p className="text-xs text-muted-foreground">{product.stock}+ Stock</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{formatCurrency(product.price)}</p>
                      <Badge variant="success" className="text-xs">25%</Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Low Stock Products */}
          <Card data-testid="card-low-stock">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">Produk Stok Rendah</CardTitle>
                <Button variant="link" className="text-sm text-primary font-medium p-0 h-auto" data-testid="link-view-all-low-stock">
                  Lihat Semua
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!lowStockProducts || lowStockProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Tidak ada produk dengan stok rendah
                </div>
              ) : (
                lowStockProducts.slice(0, 5).map((product: any) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg border border-warning/20 bg-warning/5" data-testid={`low-stock-${product.id}`}>
                    <img 
                      src={product.imageUrl || "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
                      alt={product.name} 
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-foreground mb-1">{product.name}</h4>
                      <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="warning" className="mb-1">Stok Rendah</Badge>
                      <p className="text-sm font-bold text-foreground">{product.stock} pcs</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Sales and Top Customers */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sales */}
          <Card data-testid="card-recent-sales">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">Penjualan Terbaru</CardTitle>
                <select className="px-3 py-1.5 text-sm border border-border rounded-md bg-background" data-testid="select-recent-sales-period">
                  <option>Minggu Ini</option>
                  <option>Hari Ini</option>
                  <option>Bulan Ini</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {!recentSales || recentSales.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Belum ada data penjualan terbaru
                </div>
              ) : (
                recentSales.map((sale: any) => (
                  <div key={sale.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors" data-testid={`sale-${sale.id}`}>
                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-foreground">Penjualan #{sale.id.slice(-8)}</h4>
                      <p className="text-xs text-muted-foreground">{sale.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-foreground mb-1">{formatCurrency(sale.total)}</p>
                      <Badge variant={sale.status === "completed" ? "success" : sale.status === "pending" ? "warning" : "danger"}>
                        {sale.status === "completed" ? "Selesai" : sale.status === "pending" ? "Pending" : "Dibatalkan"}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Top Customers */}
          <Card data-testid="card-top-customers">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">Pelanggan Teratas</CardTitle>
                <Button variant="link" className="text-sm text-primary font-medium p-0 h-auto" data-testid="link-view-all-customers">
                  Lihat Semua
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!topCustomers || topCustomers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Belum ada data pelanggan
                </div>
              ) : (
                topCustomers.map((customer: any) => (
                  <div key={customer.id} className="flex items-center gap-3" data-testid={`customer-${customer.id}`}>
                    <img 
                      src={customer.avatarUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"} 
                      alt={customer.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-foreground">{customer.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {customer.country} • {customer.totalOrders} Orders
                      </p>
                    </div>
                    <p className="font-bold text-sm text-primary">
                      {formatCurrency(customer.totalSpent || "0")}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
