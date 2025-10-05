import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Eye, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getExpiredProducts, getCategories } from "@/lib/api";
import type { Product, Category } from "@shared/schema";

const formatCurrency = (amount: string | number) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

const formatDate = (date: Date | string | null) => {
  if (!date) return "N/A";
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDaysExpired = (expiryDate: Date | string | null) => {
  if (!expiryDate) return 0;
  const today = new Date();
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const diffTime = today.getTime() - expiry.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function ExpiredProducts() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: expiredProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/expired"],
    queryFn: getExpiredProducts,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: getCategories,
  });

  const filteredProducts = expiredProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading expired products...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Produk Kadaluarsa</h1>
          <p className="text-muted-foreground">Daftar produk yang sudah melewati tanggal kadaluarsa</p>
        </div>
        <Badge variant="danger" className="text-lg px-4 py-2">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {expiredProducts.length} Produk Kadaluarsa
        </Badge>
      </div>

      {expiredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tidak Ada Produk Kadaluarsa</h3>
              <p className="text-muted-foreground">
                Semua produk masih dalam kondisi baik dan belum melewati tanggal kadaluarsa.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Daftar Produk Kadaluarsa</CardTitle>
              <div className="text-sm text-muted-foreground">
                Total: {filteredProducts.length} produk
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari produk kadaluarsa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-expired-products"
              />
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
                  <TableHead>Tanggal Kadaluarsa</TableHead>
                  <TableHead>Kadaluarsa Sejak</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Tidak ada produk yang sesuai pencarian" : "Tidak ada produk kadaluarsa"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const category = categories.find((cat) => cat.id === product.categoryId);
                    const daysExpired = getDaysExpired(product.expiryDate);
                    return (
                      <TableRow key={product.id} className="table-row" data-testid={`row-expired-product-${product.id}`}>
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
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-danger" />
                            <span className="text-danger font-medium">
                              {formatDate(product.expiryDate)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="danger">
                            {daysExpired} hari
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${product.stock > 0 ? 'text-warning' : 'text-muted-foreground'}`}>
                            {product.stock} unit
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold">{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            data-testid={`button-view-${product.id}`}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Lihat
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
      )}
    </div>
  );
}
