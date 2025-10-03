import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, getCategories, getCustomers, createSale } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Search, Plus, Minus, Trash2, X, RotateCcw, RefreshCcw, Check } from "lucide-react";
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
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 5 },
      },
      {
        breakpoint: 800,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 776,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 567,
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
    <div className="page-wrapper pos-pg-wrapper ms-0">
      <div className="content pos-design p-0">
        <div className="btn-row d-sm-flex align-items-center">
          <Button
            variant="secondary"
            className="mb-xs-3 me-2"
            data-testid="button-view-orders"
          >
            <span className="me-1 d-flex align-items-center">
              <ShoppingCart className="feather-16" />
            </span>
            View Orders
          </Button>
          <Button
            variant="default"
            className="me-2"
            onClick={clearCart}
            disabled={cart.length === 0}
            data-testid="button-reset"
          >
            <span className="me-1 d-flex align-items-center">
              <RotateCcw className="feather-16" />
            </span>
            Reset
          </Button>
          <Button
            variant="default"
            data-testid="button-transaction"
          >
            <span className="me-1 d-flex align-items-center">
              <RefreshCcw className="feather-16" />
            </span>
            Transaction
          </Button>
        </div>

        <div className="row align-items-start pos-wrapper">
          <div className="col-md-12 col-lg-8">
            <div className="pos-categories tabs_wrapper">
              <h5>Categories</h5>
              <p>Select From Below Categories</p>
              <Slider {...sliderSettings} className="tabs owl-carousel pos-category">
                <div 
                  className={`pos-slick-item ${selectedCategory === "all" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("all")}
                  data-testid="category-all"
                >
                  <div className="category-icon">
                    <ShoppingCart size={32} />
                  </div>
                  <h6>All Categories</h6>
                  <span>{products.length} Items</span>
                </div>
                {categories.map((category: any) => (
                  <div
                    key={category.id}
                    className={`pos-slick-item ${selectedCategory === category.id ? "active" : ""}`}
                    onClick={() => setSelectedCategory(category.id)}
                    data-testid={`category-${category.id}`}
                  >
                    <div className="category-icon">
                      <span className="category-letter">{category.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <h6>{category.name}</h6>
                    <span>
                      {products.filter((p: any) => p.categoryId === category.id).length} Items
                    </span>
                  </div>
                ))}
              </Slider>

              <div className="pos-products">
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="mb-3">Products</h5>
                </div>
                <div className="tabs_container">
                  <div className="tab_content active">
                    <div className="row">
                      {filteredProducts.map((product: any) => (
                        <div key={product.id} className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div 
                            className="product-info default-cover card"
                            onClick={() => addToCart(product)}
                            data-testid={`product-${product.id}`}
                          >
                            <div className="img-bg">
                              {product.image ? (
                                <img src={product.image} alt={product.name} />
                              ) : (
                                <div className="placeholder-img">
                                  <ShoppingCart size={40} color="#ccc" />
                                </div>
                              )}
                              <span className="check-icon">
                                <Check className="feather-16" />
                              </span>
                            </div>
                            <h6 className="cat-name">
                              {categories.find((c: any) => c.id === product.categoryId)?.name || "Product"}
                            </h6>
                            <h6 className="product-name">{product.name}</h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>{product.stock} Pcs</span>
                              <p>${product.price}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredProducts.length === 0 && (
                        <div className="col-12 text-center py-5">
                          <p className="text-muted">No products found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12 col-lg-4 ps-0">
            <aside className="product-order-list">
              <div className="head d-flex align-items-center justify-content-between w-100">
                <div>
                  <h5>Order List</h5>
                  <span>Transaction ID : #{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
              </div>

              <div className="customer-info block-section">
                <h6>Customer Information</h6>
                <div className="input-block">
                  <select
                    className="form-select"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    data-testid="select-customer"
                  >
                    <option value="walk-in">Walk-in Customer</option>
                    {customers.map((customer: any) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="product-added block-section">
                <div className="head-text d-flex align-items-center justify-content-between">
                  <h6 className="d-flex align-items-center mb-0">
                    Product Added<span className="count">{cart.length}</span>
                  </h6>
                </div>
                <div className="product-wrap">
                  {cart.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      <ShoppingCart size={40} className="mb-2" />
                      <p>Cart is empty</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="product-list d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center product-info">
                          <div className="img-bg">
                            {item.image ? (
                              <img src={item.image} alt={item.name} />
                            ) : (
                              <div className="placeholder-img-sm">
                                <ShoppingCart size={20} color="#ccc" />
                              </div>
                            )}
                          </div>
                          <div className="info">
                            <h6>{item.name}</h6>
                            <p>${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center action">
                          <div className="qty-item text-center">
                            <button
                              className="dec d-flex justify-content-center align-items-center"
                              onClick={() => updateQuantity(item.id, -1)}
                              data-testid={`button-decrease-${item.id}`}
                            >
                              <Minus size={14} />
                            </button>
                            <input
                              type="text"
                              className="form-control text-center"
                              value={item.quantity}
                              readOnly
                              data-testid={`input-quantity-${item.id}`}
                            />
                            <button
                              className="inc d-flex justify-content-center align-items-center"
                              onClick={() => updateQuantity(item.id, 1)}
                              data-testid={`button-increase-${item.id}`}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            className="btn btn-sm btn-icon delete-icon"
                            onClick={() => removeFromCart(item.id)}
                            data-testid={`button-remove-${item.id}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="block-section">
                <div className="order-total">
                  <table className="table table-responsive table-borderless">
                    <tbody>
                      <tr>
                        <td>Sub Total</td>
                        <td className="text-end">${subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>
                          <div className="input-block mb-0">
                            <label>Discount (%)</label>
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
                              data-testid="input-discount"
                            />
                          </div>
                        </td>
                        <td className="text-end">-${discountAmount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>
                          <div className="input-block mb-0">
                            <label>Tax (%)</label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={tax}
                              onChange={(e) =>
                                setTax(Math.max(0, parseFloat(e.target.value) || 0))
                              }
                              data-testid="input-tax"
                            />
                          </div>
                        </td>
                        <td className="text-end">${taxAmount.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="block-section payment-method">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="default-cover">
                    <h6>Grand Total</h6>
                  </div>
                  <div className="btn-total">
                    <h6 className="text-primary">${total.toFixed(2)}</h6>
                  </div>
                </div>
              </div>

              <div className="btn-row d-sm-flex align-items-center justify-content-between">
                <Button
                  className="btn-totallabel w-100"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || createSaleMutation.isPending}
                  data-testid="button-complete-sale"
                >
                  {createSaleMutation.isPending ? "Processing..." : "Complete Sale"}
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
