import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, getCategories, getCustomers, createSale } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Search, Plus, Minus, Trash2, X } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../style/pos.css";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("walk-in");
  const [searchTerm, setSearchTerm] = useState("");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(10);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const createSaleMutation = useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      toast({
        title: "Sale completed",
        description: "Sale has been processed successfully",
      });
      setCart([]);
      setDiscount(0);
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process sale",
        variant: "destructive",
      });
    },
  });

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 5 },
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 2 },
      },
    ],
  };

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory && product.stock > 0;
  });

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: "Stock limit reached",
          description: "Cannot add more items than available in stock",
          variant: "destructive",
        });
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          quantity: 1,
          image: product.image,
        },
      ]);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    const item = cart.find((i) => i.id === id);
    const product = products.find((p: any) => p.id === id);

    if (!item || !product) return;

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    if (newQuantity > product.stock) {
      toast({
        title: "Stock limit reached",
        description: "Cannot add more items than available in stock",
        variant: "destructive",
      });
      return;
    }

    setCart(
      cart.map((cartItem) =>
        cartItem.id === id
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const taxAmount = ((subtotal - discountAmount) * tax) / 100;
  const total = subtotal - discountAmount + taxAmount;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to cart before checkout",
        variant: "destructive",
      });
      return;
    }

    const saleData = {
      customerId: selectedCustomer,
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: subtotal.toFixed(2),
      discount: discountAmount.toFixed(2),
      tax: taxAmount.toFixed(2),
      total: total.toFixed(2),
      paymentMethod: "cash",
    };

    createSaleMutation.mutate(saleData);
  };

  return (
    <div className="pos-design">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="mb-0">Point of Sale</h4>
        <div className="d-flex gap-2">
          <Button
            variant="outline"
            onClick={clearCart}
            disabled={cart.length === 0}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <Card className="p-4 mb-4">
            <div className="mb-3">
              <h5 className="mb-2">Categories</h5>
              <Slider {...sliderSettings} className="category-slider">
                <div
                  onClick={() => setSelectedCategory("all")}
                  className={`category-item ${
                    selectedCategory === "all" ? "active" : ""
                  }`}
                  style={{ cursor: "pointer", textAlign: "center", padding: "10px" }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      margin: "0 auto 8px",
                      borderRadius: "8px",
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ShoppingCart size={30} />
                  </div>
                  <h6 style={{ fontSize: "14px", margin: 0 }}>All</h6>
                  <span style={{ fontSize: "12px", color: "#666" }}>
                    {products.length} Items
                  </span>
                </div>
                {categories.map((category: any) => (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`category-item ${
                      selectedCategory === category.id ? "active" : ""
                    }`}
                    style={{ cursor: "pointer", textAlign: "center", padding: "10px" }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        margin: "0 auto 8px",
                        borderRadius: "8px",
                        background: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                      }}
                    >
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                    <h6 style={{ fontSize: "14px", margin: 0 }}>
                      {category.name}
                    </h6>
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {
                        products.filter(
                          (p: any) => p.categoryId === category.id
                        ).length
                      }{" "}
                      Items
                    </span>
                  </div>
                ))}
              </Slider>
            </div>

            <div className="mb-3">
              <div className="position-relative">
                <Search
                  className="position-absolute"
                  size={18}
                  style={{ left: "10px", top: "50%", transform: "translateY(-50%)" }}
                />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  style={{ paddingLeft: "40px" }}
                />
              </div>
            </div>

            <div className="row">
              {filteredProducts.map((product: any) => (
                <div key={product.id} className="col-md-4 col-lg-3 mb-3">
                  <Card
                    className="product-card h-100"
                    onClick={() => addToCart(product)}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      style={{
                        height: "150px",
                        background: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "8px 8px 0 0",
                      }}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ maxHeight: "100%", maxWidth: "100%" }}
                        />
                      ) : (
                        <ShoppingCart size={40} color="#ccc" />
                      )}
                    </div>
                    <div className="p-3">
                      <h6
                        className="mb-1"
                        style={{ fontSize: "14px", fontWeight: 600 }}
                      >
                        {product.name}
                      </h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <span style={{ fontSize: "12px", color: "#666" }}>
                          {product.stock} in stock
                        </span>
                        <strong style={{ color: "#2563eb" }}>
                          ${product.price}
                        </strong>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-12 text-center py-5">
                  <p className="text-muted">No products found</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="col-lg-4">
          <Card className="p-4 sticky-top" style={{ top: "20px" }}>
            <h5 className="mb-3 d-flex align-items-center gap-2">
              <ShoppingCart size={20} />
              Cart ({cart.length})
            </h5>

            <div className="mb-3">
              <Label>Customer</Label>
              <select
                className="form-select"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="walk-in">Walk-in Customer</option>
                {customers.map((customer: any) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="cart-items mb-3"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {cart.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <ShoppingCart size={40} className="mb-2" />
                  <p>Cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom"
                  >
                    <div className="flex-grow-1">
                      <h6 className="mb-1" style={{ fontSize: "14px" }}>
                        {item.name}
                      </h6>
                      <p className="mb-0" style={{ fontSize: "13px", color: "#666" }}>
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus size={14} />
                      </Button>
                      <span style={{ minWidth: "30px", textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mb-3">
              <div className="row mb-2">
                <div className="col-6">
                  <Label>Discount (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) =>
                      setDiscount(
                        Math.min(100, Math.max(0, parseFloat(e.target.value) || 0))
                      )
                    }
                  />
                </div>
                <div className="col-6">
                  <Label>Tax (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={tax}
                    onChange={(e) =>
                      setTax(Math.max(0, parseFloat(e.target.value) || 0))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="border-top pt-3 mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              {discount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Discount ({discount}%):</span>
                  <strong>-${discountAmount.toFixed(2)}</strong>
                </div>
              )}
              <div className="d-flex justify-content-between mb-2">
                <span>Tax ({tax}%):</span>
                <strong>${taxAmount.toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-3 fs-5">
                <strong>Total:</strong>
                <strong className="text-primary">${total.toFixed(2)}</strong>
              </div>
            </div>

            <Button
              className="w-100"
              size="lg"
              onClick={handleCheckout}
              disabled={cart.length === 0 || createSaleMutation.isPending}
            >
              {createSaleMutation.isPending ? "Processing..." : "Complete Sale"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
