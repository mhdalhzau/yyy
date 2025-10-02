import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, AlertTriangle, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getLowStockProducts, getCategories } from "@/lib/api";

const formatCurrency = (amount: string | number) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

export default function LowStock() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: lowStockProducts = [], isLoading } = useQuery({
    queryKey: ["/api/products/low-stock"],
    queryFn: getLowStockProducts,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: getCategories,
  });

  const filteredProducts = lowStockProducts.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading low stock products...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-warning/10 rounded-lg">
          <AlertTriangle className="w-8 h-8 text-warning" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Stok Rendah</h1>
          <p className="text-muted-foreground">Produk yang perlu direstock segera</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Produk Stok Rendah</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-low-stock-count">
                  {lowStockProducts.length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <Package className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stok Habis</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-out-of-stock-count">
                  {lowStockProducts.filter((p: any) => p.stock === 0).length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <Package className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Perlu Restock</p>
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-restock-count">
                  {lowStockProducts.filter((p: any) => p.stock > 0 && p.stock <= p.minStock).length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk Stok Rendah</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-products"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
              data-testid="select-category-filter"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gambar</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Stok Saat Ini</TableHead>
                <TableHead>Min. Stok</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {searchTerm || selectedCategory ? 
                      "Tidak ada produk yang sesuai filter" : 
                      "Tidak ada produk dengan stok rendah"
                    }
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product: any) => {
                  const category = categories.find((cat: any) => cat.id === product.categoryId);
                  const isOutOfStock = product.stock === 0;
                  const isLowStock = product.stock > 0 && product.stock <= product.minStock;
                  
                  return (
                    <TableRow key={product.id} className="table-row" data-testid={`row-product-${product.id}`}>
                      <TableCell>
                        <img
                          src={product.imageUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-semibold">{product.name}</TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>{category?.name || "Tidak ada kategori"}</TableCell>
                      <TableCell>
                        <span className={`font-bold ${isOutOfStock ? 'text-destructive' : 'text-warning'}`}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{product.minStock}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(product.price)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={isOutOfStock ? "danger" : "warning"}
                          data-testid={`badge-status-${product.id}`}
                        >
                          {isOutOfStock ? "Stok Habis" : "Stok Rendah"}
                        </Badge>
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
