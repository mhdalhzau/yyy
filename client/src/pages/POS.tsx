import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProducts, getCategories, getCustomers, createSale } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, Plus, Minus, Trash2, UserPlus, MoreVertical,
  Tag, Grid
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
  sku?: string;
}

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("walk-in");
  const [discount, setDiscount] = useState(5);
  const [tax, setTax] = useState(5);
  const [shipping, setShipping] = useState(43.21);
  const [coupon, setCoupon] = useState(25);
  const { toast } = useToast();

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
    queryFn: getProducts,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: getCategories,
  });

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ["/api/customers"],
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
      setShipping(43.21);
      setCoupon(25);
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sales/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
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
          imageUrl: product.imageUrl,
          sku: product.sku,
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
    setDiscount(5);
    setShipping(43.21);
    setCoupon(25);
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

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div style={{ padding: '0', margin: '0', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Top Button Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        padding: '15px 20px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <button 
          style={{
            backgroundColor: '#1e3a8a',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '500'
          }}
          data-testid="button-view-brands"
        >
          <Tag size={16} />
          View All Brands
        </button>
        <button 
          style={{
            backgroundColor: '#f59e0b',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '500'
          }}
          data-testid="button-barcode"
        >
          <Grid size={16} />
          Barcode
        </button>
        <button 
          style={{
            backgroundColor: '#f97316',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
          data-testid="button-dashboard"
        >
          Dashboard
        </button>
        <button 
          style={{
            backgroundColor: '#06b6d4',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
          data-testid="button-store"
        >
          Freshmart
        </button>
      </div>

      {/* Main POS Layout */}
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        {/* Left Sidebar - Categories */}
        <div style={{ 
          width: '80px', 
          backgroundColor: 'white',
          borderRight: '1px solid #e5e7eb',
          overflowY: 'auto',
          padding: '10px 0'
        }}>
          <div 
            onClick={() => setSelectedCategory("all")}
            style={{
              padding: '12px 8px',
              cursor: 'pointer',
              backgroundColor: selectedCategory === "all" ? '#a855f7' : 'transparent',
              color: selectedCategory === "all" ? 'white' : '#6b7280',
              textAlign: 'center',
              borderRadius: '8px',
              margin: '0 8px 8px 8px',
              transition: 'all 0.2s'
            }}
            data-testid="category-all"
          >
            <div style={{ 
              width: '40px', 
              height: '40px', 
              margin: '0 auto 6px',
              backgroundColor: selectedCategory === "all" ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Grid size={20} />
            </div>
            <div style={{ fontSize: '11px', fontWeight: '500' }}>All</div>
          </div>
          {categories.map((category: any) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: '12px 8px',
                cursor: 'pointer',
                backgroundColor: selectedCategory === category.id ? '#a855f7' : 'transparent',
                color: selectedCategory === category.id ? 'white' : '#6b7280',
                textAlign: 'center',
                borderRadius: '8px',
                margin: '0 8px 8px 8px',
                transition: 'all 0.2s'
              }}
              data-testid={`category-${category.id}`}
            >
              <div style={{ 
                width: '40px', 
                height: '40px', 
                margin: '0 auto 6px',
                backgroundColor: selectedCategory === category.id ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px'
              }}>
                {category.name.substring(0, 2).toUpperCase()}
              </div>
              <div style={{ fontSize: '11px', fontWeight: '500' }}>{category.name}</div>
            </div>
          ))}
        </div>

        {/* Center - Products Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <h6 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
            Products
          </h6>
          
          {productsLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '16px'
            }}>
              {filteredProducts.map((product: any) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  data-testid={`product-${product.id}`}
                >
                  <div style={{ 
                    position: 'relative',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '12px',
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    ) : (
                      <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        backgroundColor: '#e5e7eb',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af'
                      }}>
                        <ShoppingCart size={30} />
                      </div>
                    )}
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      backgroundColor: '#a855f7',
                      color: 'white',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Plus size={16} />
                    </div>
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#6b7280', 
                      marginBottom: '4px',
                      textTransform: 'capitalize'
                    }}>
                      {categories.find((c: any) => c.id === product.categoryId)?.name || "Product"}
                    </div>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: '#111827',
                      marginBottom: '8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {product.name}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}>
                      <span style={{ fontSize: '11px', color: '#6b7280' }}>
                        {product.stock} Pcs
                      </span>
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: '700', 
                        color: '#f97316' 
                      }}>
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div style={{ 
                  gridColumn: '1 / -1', 
                  textAlign: 'center', 
                  padding: '40px',
                  color: '#9ca3af'
                }}>
                  No products found in this category
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar - Order List */}
        <div style={{ 
          width: '380px', 
          backgroundColor: 'white',
          borderLeft: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          {/* Order Header */}
          <div style={{ 
            padding: '20px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h6 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: '#111827' }}>
                  Order List
                </h6>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  Transaction ID : #POS{Date.now().toString().slice(-6)}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={clearCart}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#ef4444'
                  }}
                  data-testid="button-clear-all-header"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#6b7280'
                  }}
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <h6 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
              Customer Information
            </h6>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
                data-testid="select-customer"
              >
                <option value="walk-in">Walk-in Customer</option>
                {customers.map((customer: any) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <button
                style={{
                  backgroundColor: '#f97316',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                data-testid="button-add-customer"
              >
                <UserPlus size={18} />
              </button>
            </div>
          </div>

          {/* Product Added */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              padding: '20px 20px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h6 style={{ fontSize: '14px', fontWeight: '600', margin: 0, color: '#111827' }}>
                  Product Added
                </h6>
                <span style={{
                  backgroundColor: '#f97316',
                  color: 'white',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {cart.length}
                </span>
              </div>
              <button
                onClick={clearCart}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: '500'
                }}
                data-testid="button-clear-all"
              >
                Clear all
                <Trash2 size={14} />
              </button>
            </div>

            <div style={{ padding: '0 20px 20px' }}>
              {cart.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  color: '#9ca3af'
                }}>
                  <ShoppingCart size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <p style={{ margin: 0, fontSize: '14px' }}>Cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      alignItems: 'center'
                    }}
                    data-testid={`cart-item-${item.id}`}
                  >
                    <div style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name}
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '100%',
                            objectFit: 'contain'
                          }}
                        />
                      ) : (
                        <ShoppingCart size={24} style={{ color: '#d1d5db' }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        color: '#111827',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#f97316' }}>
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      padding: '4px'
                    }}>
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          border: '1px solid #e5e7eb',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#6b7280'
                        }}
                        data-testid={`button-decrease-${item.id}`}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ 
                        minWidth: '24px', 
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#111827'
                      }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          border: '1px solid #e5e7eb',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#6b7280'
                        }}
                        data-testid={`button-increase-${item.id}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: '#ef4444'
                      }}
                      data-testid={`button-delete-${item.id}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payment Summary - Only show when cart has items */}
          {cart.length > 0 && (
            <div style={{ borderTop: '2px solid #e5e7eb' }}>
              {/* Payment Summary Details */}
              <div style={{ padding: '20px' }}>
                <h6 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
                  Payment Summary
                </h6>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6b7280' }}>Shipping</span>
                    <span style={{
                      backgroundColor: '#1f2937',
                      color: 'white',
                      padding: '2px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      ${shipping.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6b7280' }}>Tax ({tax}%)</span>
                    <span style={{ color: '#111827', fontWeight: '500' }}>
                      ${taxAmount.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6b7280' }}>Coupon</span>
                    <span style={{ color: '#ef4444', fontWeight: '500' }}>
                      -${coupon.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6b7280' }}>Discount ({discount}%)</span>
                    <span style={{ color: '#ef4444', fontWeight: '500' }}>
                      -${discountAmount.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid #e5e7eb',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    <span style={{ color: '#111827' }}>Sub Total</span>
                    <span style={{ color: '#111827' }}>${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Tax, Shipping, Discount Controls */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <label style={{ 
                      fontSize: '11px', 
                      color: '#6b7280', 
                      display: 'block',
                      marginBottom: '4px',
                      fontWeight: '500'
                    }}>
                      Tax (%)
                    </label>
                    <select
                      value={tax}
                      onChange={(e) => setTax(parseFloat(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '12px',
                        backgroundColor: 'white',
                        cursor: 'pointer'
                      }}
                      data-testid="select-tax"
                    >
                      <option value="5">5%</option>
                      <option value="10">10%</option>
                      <option value="15">15%</option>
                      <option value="20">20%</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ 
                      fontSize: '11px', 
                      color: '#6b7280', 
                      display: 'block',
                      marginBottom: '4px',
                      fontWeight: '500'
                    }}>
                      Shipping
                    </label>
                    <input
                      type="number"
                      value={shipping}
                      onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '12px'
                      }}
                      step="0.01"
                      min="0"
                      data-testid="input-shipping"
                    />
                  </div>
                  <div>
                    <label style={{ 
                      fontSize: '11px', 
                      color: '#6b7280', 
                      display: 'block',
                      marginBottom: '4px',
                      fontWeight: '500'
                    }}>
                      Discount (%)
                    </label>
                    <select
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '12px',
                        backgroundColor: 'white',
                        cursor: 'pointer'
                      }}
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

                {/* Grand Total Button */}
                <button
                  style={{
                    width: '100%',
                    backgroundColor: '#1e3a8a',
                    color: 'white',
                    padding: '14px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '16px',
                    cursor: 'default',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>Grand Total</span>
                  <span>${total.toFixed(2)}</span>
                </button>

                {/* Action Buttons */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px'
                }}>
                  <button
                    onClick={() => toast({ title: "Hold", description: "Order on hold" })}
                    style={{
                      backgroundColor: '#f97316',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    data-testid="button-hold"
                  >
                    Hold
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={createSaleMutation.isPending}
                    style={{
                      backgroundColor: '#06b6d4',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      opacity: createSaleMutation.isPending ? 0.6 : 1
                    }}
                    data-testid="button-payment"
                  >
                    {createSaleMutation.isPending ? "Processing..." : "Payment"}
                  </button>
                  <button
                    onClick={clearCart}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    data-testid="button-void"
                  >
                    Void
                  </button>
                  <button
                    onClick={() => toast({ title: "View Orders", description: "Opening orders..." })}
                    style={{
                      backgroundColor: '#a855f7',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    data-testid="button-view-orders"
                  >
                    View Orders
                  </button>
                  <button
                    onClick={clearCart}
                    style={{
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    data-testid="button-reset"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => toast({ title: "Transaction", description: "View transactions..." })}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    data-testid="button-transaction"
                  >
                    Transaction
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
