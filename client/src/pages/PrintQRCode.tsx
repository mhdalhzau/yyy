import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Printer, Search, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getProducts } from "@/lib/api";
import type { Product } from "@shared/schema";

export default function PrintQRCode() {
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
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Cetak QR Code</h1>
          <p className="text-muted-foreground">Pilih produk untuk mencetak QR Code</p>
        </div>
        <Button 
          className="btn-primary"
          onClick={handlePrint}
          disabled={selectedProducts.length === 0}
          data-testid="button-print-qrcode"
        >
          <Printer className="w-4 h-4 mr-2" />
          Cetak QR Code ({selectedProducts.length})
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
            <CardTitle>Preview QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedProducts.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <QrCode className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Pilih produk untuk melihat preview QR Code</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                {selectedProductsData.map((product) => (
                  <div
                    key={product.id}
                    className="border border-border rounded-lg p-4 text-center"
                    data-testid={`preview-qrcode-${product.id}`}
                  >
                    <div className="font-semibold text-sm mb-2 truncate">{product.name}</div>
                    <div className="bg-white p-2 rounded inline-block">
                      <svg
                        width="120"
                        height="120"
                        viewBox="0 0 120 120"
                      >
                        <rect width="120" height="120" fill="white" />
                        <rect x="10" y="10" width="8" height="8" fill="black" />
                        <rect x="26" y="10" width="8" height="8" fill="black" />
                        <rect x="34" y="10" width="8" height="8" fill="black" />
                        <rect x="50" y="10" width="8" height="8" fill="black" />
                        <rect x="66" y="10" width="8" height="8" fill="black" />
                        <rect x="82" y="10" width="8" height="8" fill="black" />
                        <rect x="90" y="10" width="8" height="8" fill="black" />
                        <rect x="98" y="10" width="8" height="8" fill="black" />
                        
                        <rect x="10" y="18" width="8" height="8" fill="black" />
                        <rect x="42" y="18" width="8" height="8" fill="black" />
                        <rect x="66" y="18" width="8" height="8" fill="black" />
                        <rect x="98" y="18" width="8" height="8" fill="black" />
                        
                        <rect x="10" y="26" width="8" height="8" fill="black" />
                        <rect x="26" y="26" width="8" height="8" fill="black" />
                        <rect x="34" y="26" width="8" height="8" fill="black" />
                        <rect x="42" y="26" width="8" height="8" fill="black" />
                        <rect x="58" y="26" width="8" height="8" fill="black" />
                        <rect x="82" y="26" width="8" height="8" fill="black" />
                        <rect x="90" y="26" width="8" height="8" fill="black" />
                        <rect x="98" y="26" width="8" height="8" fill="black" />
                        
                        <rect x="10" y="50" width="8" height="8" fill="black" />
                        <rect x="26" y="50" width="8" height="8" fill="black" />
                        <rect x="50" y="50" width="8" height="8" fill="black" />
                        <rect x="74" y="50" width="8" height="8" fill="black" />
                        <rect x="90" y="50" width="8" height="8" fill="black" />
                        
                        <rect x="10" y="82" width="8" height="8" fill="black" />
                        <rect x="26" y="82" width="8" height="8" fill="black" />
                        <rect x="34" y="82" width="8" height="8" fill="black" />
                        <rect x="42" y="82" width="8" height="8" fill="black" />
                        <rect x="58" y="82" width="8" height="8" fill="black" />
                        <rect x="74" y="82" width="8" height="8" fill="black" />
                        <rect x="98" y="82" width="8" height="8" fill="black" />
                        
                        <rect x="10" y="90" width="8" height="8" fill="black" />
                        <rect x="42" y="90" width="8" height="8" fill="black" />
                        <rect x="66" y="90" width="8" height="8" fill="black" />
                        <rect x="82" y="90" width="8" height="8" fill="black" />
                        <rect x="98" y="90" width="8" height="8" fill="black" />
                        
                        <rect x="10" y="98" width="8" height="8" fill="black" />
                        <rect x="26" y="98" width="8" height="8" fill="black" />
                        <rect x="34" y="98" width="8" height="8" fill="black" />
                        <rect x="42" y="98" width="8" height="8" fill="black" />
                        <rect x="50" y="98" width="8" height="8" fill="black" />
                        <rect x="66" y="98" width="8" height="8" fill="black" />
                        <rect x="74" y="98" width="8" height="8" fill="black" />
                        <rect x="82" y="98" width="8" height="8" fill="black" />
                        <rect x="90" y="98" width="8" height="8" fill="black" />
                        <rect x="98" y="98" width="8" height="8" fill="black" />
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
        <h1 className="text-2xl font-bold text-center mb-8">QR Code Produk</h1>
        <div className="grid grid-cols-3 gap-6">
          {selectedProductsData.map((product) => (
            <div key={product.id} className="border-2 border-black rounded-lg p-4 text-center break-inside-avoid">
              <div className="font-semibold text-sm mb-3">{product.name}</div>
              <div className="bg-white p-4 inline-block">
                <svg
                  width="160"
                  height="160"
                  viewBox="0 0 160 160"
                >
                  <rect width="160" height="160" fill="white" />
                  <rect x="15" y="15" width="10" height="10" fill="black" />
                  <rect x="35" y="15" width="10" height="10" fill="black" />
                  <rect x="45" y="15" width="10" height="10" fill="black" />
                  <rect x="65" y="15" width="10" height="10" fill="black" />
                  <rect x="85" y="15" width="10" height="10" fill="black" />
                  <rect x="105" y="15" width="10" height="10" fill="black" />
                  <rect x="115" y="15" width="10" height="10" fill="black" />
                  <rect x="125" y="15" width="10" height="10" fill="black" />
                  
                  <rect x="15" y="25" width="10" height="10" fill="black" />
                  <rect x="55" y="25" width="10" height="10" fill="black" />
                  <rect x="85" y="25" width="10" height="10" fill="black" />
                  <rect x="125" y="25" width="10" height="10" fill="black" />
                  
                  <rect x="15" y="35" width="10" height="10" fill="black" />
                  <rect x="35" y="35" width="10" height="10" fill="black" />
                  <rect x="45" y="35" width="10" height="10" fill="black" />
                  <rect x="55" y="35" width="10" height="10" fill="black" />
                  <rect x="75" y="35" width="10" height="10" fill="black" />
                  <rect x="105" y="35" width="10" height="10" fill="black" />
                  <rect x="115" y="35" width="10" height="10" fill="black" />
                  <rect x="125" y="35" width="10" height="10" fill="black" />
                  
                  <rect x="15" y="65" width="10" height="10" fill="black" />
                  <rect x="35" y="65" width="10" height="10" fill="black" />
                  <rect x="65" y="65" width="10" height="10" fill="black" />
                  <rect x="95" y="65" width="10" height="10" fill="black" />
                  <rect x="115" y="65" width="10" height="10" fill="black" />
                  
                  <rect x="15" y="105" width="10" height="10" fill="black" />
                  <rect x="35" y="105" width="10" height="10" fill="black" />
                  <rect x="45" y="105" width="10" height="10" fill="black" />
                  <rect x="55" y="105" width="10" height="10" fill="black" />
                  <rect x="75" y="105" width="10" height="10" fill="black" />
                  <rect x="95" y="105" width="10" height="10" fill="black" />
                  <rect x="125" y="105" width="10" height="10" fill="black" />
                  
                  <rect x="15" y="115" width="10" height="10" fill="black" />
                  <rect x="55" y="115" width="10" height="10" fill="black" />
                  <rect x="85" y="115" width="10" height="10" fill="black" />
                  <rect x="105" y="115" width="10" height="10" fill="black" />
                  <rect x="125" y="115" width="10" height="10" fill="black" />
                  
                  <rect x="15" y="125" width="10" height="10" fill="black" />
                  <rect x="35" y="125" width="10" height="10" fill="black" />
                  <rect x="45" y="125" width="10" height="10" fill="black" />
                  <rect x="55" y="125" width="10" height="10" fill="black" />
                  <rect x="65" y="125" width="10" height="10" fill="black" />
                  <rect x="85" y="125" width="10" height="10" fill="black" />
                  <rect x="95" y="125" width="10" height="10" fill="black" />
                  <rect x="105" y="125" width="10" height="10" fill="black" />
                  <rect x="115" y="125" width="10" height="10" fill="black" />
                  <rect x="125" y="125" width="10" height="10" fill="black" />
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
