import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProducts, getCategories, getCustomers, createSale } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, RotateCcw, RefreshCcw, Plus, Minus, 
  Trash2, UserPlus, MoreVertical, Pause, CreditCard, X,
  BarChart3, Tag
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
}

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("walk-in");
  const [discount, setDiscount] = useState(5);
  const [tax, setTax] = useState(5);
  const [shipping, setShipping] = useState(40.21);
  const [coupon, setCoupon] = useState(25);
  const { toast } = useToast();

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const createSaleMutation = useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      toast({
        title: "Payment Completed",
        description: "Sale has been processed successfully",
      });
      setCart([]);
      setDiscount(5);
      setShipping(40.21);
      setCoupon(25);
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


  const filteredProducts = products.filter((product: any) => {
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory;
    return matchesCategory && product.stock > 0;
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
          sku: product.sku,
        },
      ]);
    }
    toast({
      title: "Added to cart",
      description: `${product.name} added to cart`,
    });
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
    toast({
      title: "Removed from cart",
      description: "Item removed from cart",
    });
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(5);
    setShipping(40.21);
    setCoupon(25);
    toast({
      title: "Cart cleared",
      description: "All items removed from cart",
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxAmount = ((subtotal - discountAmount + shipping) * tax) / 100;
  const total = subtotal - discountAmount + taxAmount + shipping - coupon;

  const handlePayment = () => {
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

  const handleHold = () => {
    toast({
      title: "Order on Hold",
      description: "Order has been put on hold",
    });
  };

  const handleVoid = () => {
    clearCart();
    toast({
      title: "Order Voided",
      description: "Order has been voided",
    });
  };

  const handleTransaction = () => {
    toast({
      title: "Recent Transactions",
      description: "Opening recent transactions...",
    });
  };

  const handleViewOrders = () => {
    toast({
      title: "View Orders",
      description: "Opening orders list...",
    });
  };

  const getCategoryImage = (index: number) => {
    const images = [
      "/assets/img/categories/category-01.png",
      "/assets/img/categories/category-02.png", 
      "/assets/img/categories/category-03.png",
      "/assets/img/categories/category-04.png",
      "/assets/img/categories/category-05.png",
      "/assets/img/categories/category-06.png",
    ];
    return images[index % images.length];
  };

  return (
    <div className="page-wrapper pos-pg-wrapper ms-0">
      <div className="content pos-design p-0">
        <div className="btn-row d-sm-flex align-items-center gap-2 mb-3">
          <button 
            className="btn btn-secondary"
            data-testid="button-view-brands"
            onClick={() => toast({ title: "View All Brands", description: "Opening brands list..." })}
          >
            <Tag size={16} className="me-1" />
            View All Brands
          </button>
          <button 
            className="btn btn-warning"
            data-testid="button-barcode"
            onClick={() => toast({ title: "Barcode Scanner", description: "Opening barcode scanner..." })}
          >
            <BarChart3 size={16} className="me-1" />
            Barcode
          </button>
          <button 
            className="btn btn-primary"
            data-testid="button-dashboard"
            onClick={() => toast({ title: "Dashboard", description: "Opening dashboard..." })}
          >
            Dashboard
          </button>
          <button 
            className="btn btn-info"
            data-testid="button-store"
            onClick={() => toast({ title: "Store", description: "Opening store settings..." })}
          >
            Freshmart
          </button>
        </div>

        <div className="pos-wrapper-grid">
          <aside className="pos-sidebar-categories">
            <div 
              className={`pos-category-item ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}
              data-testid="category-all"
            >
              <div className="category-icon">
                <img src="/assets/img/categories/category-01.png" alt="All" />
              </div>
              <div className="category-info">
                <h6>All</h6>
                <span>{products.length} Items</span>
              </div>
            </div>
            {categories.map((category: any, index: number) => (
              <div
                key={category.id}
                className={`pos-category-item ${selectedCategory === category.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(category.id)}
                data-testid={`category-${category.id}`}
              >
                <div className="category-icon">
                  <img src={getCategoryImage(index + 1)} alt={category.name} />
                </div>
                <div className="category-info">
                  <h6>{category.name}</h6>
                  <span>{products.filter((p: any) => p.categoryId === category.id).length} Items</span>
                </div>
              </div>
            ))}
          </aside>

          <div className="pos-products-wrapper">
            <div className="pos-products">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="mb-0">Products</h5>
              </div>
              {productsLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map((product: any) => (
                    <div key={product.id} className="product-item">
                      <div 
                        className="product-info default-cover card"
                        onClick={() => addToCart(product)}
                        data-testid={`product-${product.id}`}
                        style={{ cursor: 'pointer' }}
                      >
                        <a href="#" className="img-bg" onClick={(e) => e.preventDefault()}>
                          {product.image ? (
                            <img src={product.image} alt={product.name} />
                          ) : (
                            <img src="/assets/img/products/pos-product-01.png" alt={product.name} />
                          )}
                          <span>
                            <Plus size={16} />
                          </span>
                        </a>
                        <h6 className="cat-name">
                          <a href="#" onClick={(e) => e.preventDefault()}>
                            {categories.find((c: any) => c.id === product.categoryId)?.name || "Product"}
                          </a>
                        </h6>
                        <h6 className="product-name">
                          <a href="#" onClick={(e) => e.preventDefault()}>{product.name}</a>
                        </h6>
                        <div className="d-flex align-items-center justify-content-between price">
                          <span>{product.stock} Pcs</span>
                          <p>${product.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="col-12 text-center py-5">
                      <p className="text-muted">No products found in this category</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <aside className="product-order-list">
              <div className="head d-flex align-items-center justify-content-between w-100">
                <div>
                  <h5>Order List</h5>
                  <span>Transaction ID : #POS{Date.now().toString().slice(-6)}</span>
                </div>
                <div>
                  <a 
                    className="confirm-text" 
                    href="#"
                    onClick={(e) => { e.preventDefault(); clearCart(); }}
                    data-testid="button-clear-all-header"
                  >
                    <Trash2 size={16} className="text-danger me-1" />
                  </a>
                  <a href="#" className="text-default" onClick={(e) => e.preventDefault()}>
                    <MoreVertical size={16} />
                  </a>
                </div>
              </div>

              <div className="customer-info block-section">
                <h6>Customer Information</h6>
                <div className="input-block d-flex align-items-center">
                  <div className="flex-grow-1">
                    <select
                      className="form-select"
                      value={selectedCustomer}
                      onChange={(e) => setSelectedCustomer(e.target.value)}
                      data-testid="select-customer"
                    >
                      <option value="walk-in">Walk in Customer</option>
                      {customers.map((customer: any) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <a 
                    href="#" 
                    className="btn btn-primary btn-icon ms-2"
                    onClick={(e) => {
                      e.preventDefault();
                      toast({ title: "Add Customer", description: "Opening customer form..." });
                    }}
                    data-testid="button-add-customer"
                  >
                    <UserPlus size={16} />
                  </a>
                </div>
                {selectedCustomer !== "walk-in" && (
                  <div className="customer-details mt-3 p-3 bg-light rounded">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold">
                        {customers.find((c: any) => c.id === selectedCustomer)?.name || "Customer"}
                      </span>
                      <span className="badge bg-primary">Gold</span>
                      <span className="badge bg-success">Loyalty</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="product-added block-section">
                <div className="head-text d-flex align-items-center justify-content-between">
                  <h6 className="d-flex align-items-center mb-0">
                    Product Added
                    <span className="count ms-2">{cart.length}</span>
                  </h6>
                  <a 
                    href="#" 
                    className="d-flex align-items-center text-danger"
                    onClick={(e) => { e.preventDefault(); clearCart(); }}
                    data-testid="button-clear-all"
                  >
                    <span className="me-1">Clear all</span>
                    <X size={14} />
                  </a>
                </div>
                <div className="product-wrap">
                  {cart.length === 0 ? (
                    <div className="text-center text-muted py-4">
                      <ShoppingCart size={40} className="mb-2 opacity-50" />
                      <p>Cart is empty</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="product-list d-flex align-items-center justify-content-between" data-testid={`cart-item-${item.id}`}>
                        <div className="d-flex align-items-center product-info">
                          <a href="#" className="img-bg" onClick={(e) => e.preventDefault()}>
                            {item.image ? (
                              <img src={item.image} alt={item.name} />
                            ) : (
                              <img src="/assets/img/products/pos-product-01.png" alt={item.name} />
                            )}
                          </a>
                          <div className="info">
                            <span>{item.sku || `PT${Math.floor(Math.random() * 10000)}`}</span>
                            <h6>
                              <a href="#" onClick={(e) => e.preventDefault()}>{item.name}</a>
                            </h6>
                            <p>${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="qty-item text-center">
                          <a
                            href="#"
                            className="dec d-flex justify-content-center align-items-center"
                            onClick={(e) => { e.preventDefault(); updateQuantity(item.id, -1); }}
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <Minus size={14} />
                          </a>
                          <input
                            type="text"
                            className="form-control text-center"
                            value={item.quantity}
                            readOnly
                            data-testid={`input-quantity-${item.id}`}
                          />
                          <a
                            href="#"
                            className="inc d-flex justify-content-center align-items-center"
                            onClick={(e) => { e.preventDefault(); updateQuantity(item.id, 1); }}
                            data-testid={`button-increase-${item.id}`}
                          >
                            <Plus size={14} />
                          </a>
                        </div>
                        <div className="d-flex align-items-center action">
                          <a
                            className="btn-icon delete-icon confirm-text"
                            href="#"
                            onClick={(e) => { e.preventDefault(); removeFromCart(item.id); }}
                            data-testid={`button-delete-${item.id}`}
                          >
                            <Trash2 size={14} />
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {cart.length > 0 && (
                <>
                  <div className="block-section">
                    <div className="discount-info p-3 mb-3 d-flex align-items-start gap-2" style={{ backgroundColor: '#F3F4F6', borderRadius: '8px' }}>
                      <Tag size={20} className="text-primary mt-1" />
                      <div>
                        <div className="fw-semibold text-primary">Discount {discount}%</div>
                        <small className="text-muted">For ${subtotal >= 20 ? subtotal.toFixed(2) : '20'} Minimum Purchase, {cart.length} Items</small>
                      </div>
                    </div>
                  </div>

                  <div className="block-section">
                    <h6 className="mb-3">Payment Summary</h6>
                    <div className="order-total">
                      <table className="table table-responsive table-borderless">
                        <tbody>
                          <tr>
                            <td>Shipping</td>
                            <td className="text-end">
                              <span className="badge bg-secondary" style={{ fontSize: '12px' }}>
                                ${shipping.toFixed(2)}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>Tax ({tax}%)</td>
                            <td className="text-end">${taxAmount.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td>Coupon</td>
                            <td className="text-end text-success">-${coupon.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td>Discount ({discount}%)</td>
                            <td className="text-end text-danger">-${discountAmount.toFixed(2)}</td>
                          </tr>
                          <tr className="border-top">
                            <td className="fw-bold">Sub Total</td>
                            <td className="text-end fw-bold">${subtotal.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="block-section">
                    <div className="selling-info">
                      <div className="row">
                        <div className="col-12 col-sm-4">
                          <div className="input-block">
                            <label>Tax (%)</label>
                            <select 
                              className="form-select"
                              value={tax}
                              onChange={(e) => setTax(parseFloat(e.target.value))}
                              data-testid="select-tax"
                            >
                              <option value="5">5%</option>
                              <option value="10">10%</option>
                              <option value="15">15%</option>
                              <option value="20">20%</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-12 col-sm-4">
                          <div className="input-block">
                            <label>Shipping</label>
                            <input 
                              type="number"
                              className="form-control"
                              value={shipping}
                              onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                              data-testid="input-shipping"
                            />
                          </div>
                        </div>
                        <div className="col-12 col-sm-4">
                          <div className="input-block">
                            <label>Discount (%)</label>
                            <select 
                              className="form-select"
                              value={discount}
                              onChange={(e) => setDiscount(parseFloat(e.target.value))}
                              data-testid="select-discount"
                            >
                              <option value="0">0%</option>
                              <option value="5">5%</option>
                              <option value="10">10%</option>
                              <option value="15">15%</option>
                              <option value="20">20%</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-grid btn-block mb-3">
                    <a 
                      className="btn btn-secondary" 
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      style={{ fontSize: '16px', fontWeight: '600', padding: '12px' }}
                      data-testid="text-grand-total"
                    >
                      Grand Total : ${total.toFixed(2)}
                    </a>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <button 
                        className="btn w-100"
                        onClick={handleHold}
                        data-testid="button-hold"
                        style={{ 
                          backgroundColor: '#ff6600', 
                          borderColor: '#ff6600', 
                          color: 'white',
                          fontWeight: '600',
                          padding: '12px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <Pause size={16} />
                        Hold
                      </button>
                    </div>
                    <div className="col-6">
                      <button 
                        className="btn w-100"
                        onClick={handleVoid}
                        data-testid="button-void"
                        style={{ 
                          backgroundColor: '#3b82f6', 
                          borderColor: '#3b82f6', 
                          color: 'white',
                          fontWeight: '600',
                          padding: '12px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <X size={16} />
                        Void
                      </button>
                    </div>
                    <div className="col-6">
                      <button 
                        className="btn w-100"
                        onClick={handlePayment}
                        disabled={createSaleMutation.isPending}
                        data-testid="button-payment"
                        style={{ 
                          backgroundColor: '#06b6d4', 
                          borderColor: '#06b6d4', 
                          color: 'white',
                          fontWeight: '600',
                          padding: '12px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          opacity: createSaleMutation.isPending ? 0.7 : 1
                        }}
                      >
                        <CreditCard size={16} />
                        {createSaleMutation.isPending ? "Processing..." : "Payment"}
                      </button>
                    </div>
                    <div className="col-6">
                      <button 
                        className="btn w-100"
                        onClick={handleViewOrders}
                        data-testid="button-view-orders"
                        style={{ 
                          backgroundColor: '#6b21a8', 
                          borderColor: '#6b21a8', 
                          color: 'white',
                          fontWeight: '600',
                          padding: '12px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <ShoppingCart size={16} />
                        View Orders
                      </button>
                    </div>
                    <div className="col-6">
                      <button 
                        className="btn w-100"
                        onClick={clearCart}
                        data-testid="button-reset"
                        style={{ 
                          backgroundColor: '#9333ea', 
                          borderColor: '#9333ea', 
                          color: 'white',
                          fontWeight: '600',
                          padding: '12px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <RotateCcw size={16} />
                        Reset
                      </button>
                    </div>
                    <div className="col-6">
                      <button 
                        className="btn w-100"
                        onClick={handleTransaction}
                        data-testid="button-transaction"
                        style={{ 
                          backgroundColor: '#dc2626', 
                          borderColor: '#dc2626', 
                          color: 'white',
                          fontWeight: '600',
                          padding: '12px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <RefreshCcw size={16} />
                        Transaction
                      </button>
                    </div>
                  </div>
                </>
              )}
            </aside>
        </div>
      </div>
    </div>
  );
}
