import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Printer, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getProducts } from "@/lib/api";
import type { Product } from "@shared/schema";

export default function PrintBarcode() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: getProducts,
  });

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedProductsData = products.filter((p) => selectedProducts.includes(p.id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Cetak Barcode</h1>
          <p className="text-muted-foreground">Pilih produk untuk mencetak barcode</p>
        </div>
        <Button 
          className="btn-primary"
          onClick={handlePrint}
          disabled={selectedProducts.length === 0}
          data-testid="button-print-barcode"
        >
          <Printer className="w-4 h-4 mr-2" />
          Cetak Barcode ({selectedProducts.length})
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle>Pilih Produk</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-border rounded-md bg-background"
                data-testid="input-search-products"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b">
                <Label>Produk ({filteredProducts.length})</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSelectAll}
                  data-testid="button-select-all"
                >
                  {selectedProducts.length === filteredProducts.length ? "Batalkan Semua" : "Pilih Semua"}
                </Button>
              </div>
              <div className="max-h-[500px] overflow-y-auto space-y-2">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "Tidak ada produk yang sesuai pencarian" : "Tidak ada produk"}
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 border border-border rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleToggleProduct(product.id)}
                      data-testid={`product-item-${product.id}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleToggleProduct(product.id)}
                        className="w-4 h-4"
                        data-testid={`checkbox-product-${product.id}`}
                      />
                      <img
                        src={product.imageUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="print:hidden">
          <CardHeader>
            <CardTitle>Preview Barcode</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedProducts.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Printer className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Pilih produk untuk melihat preview barcode</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                {selectedProductsData.map((product) => (
                  <div
                    key={product.id}
                    className="border border-border rounded-lg p-4 text-center"
                    data-testid={`preview-barcode-${product.id}`}
                  >
                    <div className="font-semibold text-sm mb-2 truncate">{product.name}</div>
                    <div className="bg-white p-2 rounded">
                      <svg
                        className="mx-auto"
                        width="150"
                        height="60"
                        viewBox="0 0 150 60"
                      >
                        <rect width="2" height="60" x="5" fill="#000" />
                        <rect width="4" height="60" x="10" fill="#000" />
                        <rect width="2" height="60" x="16" fill="#000" />
                        <rect width="3" height="60" x="20" fill="#000" />
                        <rect width="2" height="60" x="25" fill="#000" />
                        <rect width="4" height="60" x="30" fill="#000" />
                        <rect width="2" height="60" x="36" fill="#000" />
                        <rect width="3" height="60" x="40" fill="#000" />
                        <rect width="2" height="60" x="45" fill="#000" />
                        <rect width="4" height="60" x="50" fill="#000" />
                        <rect width="2" height="60" x="56" fill="#000" />
                        <rect width="3" height="60" x="60" fill="#000" />
                        <rect width="2" height="60" x="65" fill="#000" />
                        <rect width="4" height="60" x="70" fill="#000" />
                        <rect width="2" height="60" x="76" fill="#000" />
                        <rect width="3" height="60" x="80" fill="#000" />
                        <rect width="2" height="60" x="85" fill="#000" />
                        <rect width="4" height="60" x="90" fill="#000" />
                        <rect width="2" height="60" x="96" fill="#000" />
                        <rect width="3" height="60" x="100" fill="#000" />
                        <rect width="2" height="60" x="105" fill="#000" />
                        <rect width="4" height="60" x="110" fill="#000" />
                        <rect width="2" height="60" x="116" fill="#000" />
                        <rect width="3" height="60" x="120" fill="#000" />
                        <rect width="2" height="60" x="125" fill="#000" />
                        <rect width="4" height="60" x="130" fill="#000" />
                        <rect width="2" height="60" x="136" fill="#000" />
                        <rect width="3" height="60" x="140" fill="#000" />
                      </svg>
                    </div>
                    <div className="text-xs font-mono mt-2">{product.sku}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="hidden print:block">
        <h1 className="text-2xl font-bold text-center mb-8">Barcode Produk</h1>
        <div className="grid grid-cols-3 gap-6">
          {selectedProductsData.map((product) => (
            <div key={product.id} className="border-2 border-black rounded-lg p-4 text-center break-inside-avoid">
              <div className="font-semibold text-sm mb-3">{product.name}</div>
              <div className="bg-white p-2">
                <svg
                  className="mx-auto"
                  width="200"
                  height="80"
                  viewBox="0 0 200 80"
                >
                  <rect width="3" height="80" x="10" fill="#000" />
                  <rect width="5" height="80" x="16" fill="#000" />
                  <rect width="3" height="80" x="24" fill="#000" />
                  <rect width="4" height="80" x="30" fill="#000" />
                  <rect width="3" height="80" x="36" fill="#000" />
                  <rect width="5" height="80" x="42" fill="#000" />
                  <rect width="3" height="80" x="50" fill="#000" />
                  <rect width="4" height="80" x="56" fill="#000" />
                  <rect width="3" height="80" x="62" fill="#000" />
                  <rect width="5" height="80" x="68" fill="#000" />
                  <rect width="3" height="80" x="76" fill="#000" />
                  <rect width="4" height="80" x="82" fill="#000" />
                  <rect width="3" height="80" x="88" fill="#000" />
                  <rect width="5" height="80" x="94" fill="#000" />
                  <rect width="3" height="80" x="102" fill="#000" />
                  <rect width="4" height="80" x="108" fill="#000" />
                  <rect width="3" height="80" x="114" fill="#000" />
                  <rect width="5" height="80" x="120" fill="#000" />
                  <rect width="3" height="80" x="128" fill="#000" />
                  <rect width="4" height="80" x="134" fill="#000" />
                  <rect width="3" height="80" x="140" fill="#000" />
                  <rect width="5" height="80" x="146" fill="#000" />
                  <rect width="3" height="80" x="154" fill="#000" />
                  <rect width="4" height="80" x="160" fill="#000" />
                  <rect width="3" height="80" x="166" fill="#000" />
                  <rect width="5" height="80" x="172" fill="#000" />
                  <rect width="3" height="80" x="180" fill="#000" />
                </svg>
              </div>
              <div className="text-xs font-mono mt-3 font-bold">{product.sku}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
