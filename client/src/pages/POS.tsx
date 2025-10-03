import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, getCategories, getCustomers, createSale } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, RotateCcw, RefreshCcw, Check, Plus, Minus, 
  Trash2, UserPlus, MoreVertical, Pause, CreditCard 
} from "lucide-react";
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
  sku?: string;
}

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("walk-in");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(5);
  const [shipping, setShipping] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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
        title: "Payment Completed",
        description: "Sale has been processed successfully",
      });
      setCart([]);
      setDiscount(0);
      setShipping(0);
      setShowPaymentModal(false);
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
    setShipping(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxAmount = ((subtotal - discountAmount + shipping) * tax) / 100;
  const total = subtotal - discountAmount + taxAmount + shipping;

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

  const getCategoryImage = (index: number) => {
    const images = [
      "assets/img/categories/category-01.png",
      "assets/img/categories/category-02.png", 
      "assets/img/categories/category-03.png",
      "assets/img/categories/category-04.png",
      "assets/img/categories/category-05.png",
      "assets/img/categories/category-06.png",
    ];
    return images[index % images.length];
  };

  return (
    <div className="page-wrapper pos-pg-wrapper ms-0">
      <div className="content pos-design p-0">
        <div className="btn-row d-sm-flex align-items-center">
          <button className="btn btn-secondary mb-xs-3 me-2">
            <span className="me-1 d-flex align-items-center">
              <ShoppingCart size={16} />
            </span>
            View Orders
          </button>
          <button 
            className="btn btn-info me-2" 
            onClick={clearCart}
            disabled={cart.length === 0}
          >
            <span className="me-1 d-flex align-items-center">
              <RotateCcw size={16} />
            </span>
            Reset
          </button>
          <button className="btn btn-primary">
            <span className="me-1 d-flex align-items-center">
              <RefreshCcw size={16} />
            </span>
            Transaction
          </button>
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
                >
                  <a href="#">
                    <img src="assets/img/categories/category-01.png" alt="All Categories" />
                  </a>
                  <h6>
                    <a href="#">All Categories</a>
                  </h6>
                  <span>{products.length} Items</span>
                </div>
                {categories.map((category: any, index: number) => (
                  <div
                    key={category.id}
                    className={`pos-slick-item ${selectedCategory === category.id ? "active" : ""}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <a href="#">
                      <img src={getCategoryImage(index + 1)} alt={category.name} />
                    </a>
                    <h6>
                      <a href="#">{category.name}</a>
                    </h6>
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
                          >
                            <a href="#" className="img-bg">
                              {product.image ? (
                                <img src={product.image} alt={product.name} />
                              ) : (
                                <img src="assets/img/products/pos-product-01.png" alt={product.name} />
                              )}
                              <span>
                                <Check size={16} />
                              </span>
                            </a>
                            <h6 className="cat-name">
                              <a href="#">
                                {categories.find((c: any) => c.id === product.categoryId)?.name || "Product"}
                              </a>
                            </h6>
                            <h6 className="product-name">
                              <a href="#">{product.name}</a>
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
                <div>
                  <a className="confirm-text" href="#">
                    <Trash2 size={16} className="text-danger me-1" onClick={clearCart} />
                  </a>
                  <a href="#" className="text-default">
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
                    >
                      <option value="walk-in">Walk-in Customer</option>
                      {customers.map((customer: any) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <a href="#" className="btn btn-primary btn-icon ms-2">
                    <UserPlus size={16} />
                  </a>
                </div>
              </div>

              <div className="product-added block-section">
                <div className="head-text d-flex align-items-center justify-content-between">
                  <h6 className="d-flex align-items-center mb-0">
                    Product Added<span className="count">{cart.length}</span>
                  </h6>
                  <a 
                    href="#" 
                    className="d-flex align-items-center text-danger"
                    onClick={(e) => { e.preventDefault(); clearCart(); }}
                  >
                    <span className="me-1">Clear all</span>
                  </a>
                </div>
                <div className="product-wrap">
                  {cart.length === 0 ? (
                    <div className="text-center text-muted py-4">
                      <ShoppingCart size={40} className="mb-2" />
                      <p>Cart is empty</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="product-list d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center product-info">
                          <a href="#" className="img-bg">
                            {item.image ? (
                              <img src={item.image} alt={item.name} />
                            ) : (
                              <img src="assets/img/products/pos-product-01.png" alt={item.name} />
                            )}
                          </a>
                          <div className="info">
                            <span>{item.sku || `PT${Math.floor(Math.random() * 10000)}`}</span>
                            <h6>
                              <a href="#">{item.name}</a>
                            </h6>
                            <p>${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="qty-item text-center">
                          <a
                            href="#"
                            className="dec d-flex justify-content-center align-items-center"
                            onClick={(e) => { e.preventDefault(); updateQuantity(item.id, -1); }}
                          >
                            <Minus size={14} />
                          </a>
                          <input
                            type="text"
                            className="form-control text-center"
                            value={item.quantity}
                            readOnly
                          />
                          <a
                            href="#"
                            className="inc d-flex justify-content-center align-items-center"
                            onClick={(e) => { e.preventDefault(); updateQuantity(item.id, 1); }}
                          >
                            <Plus size={14} />
                          </a>
                        </div>
                        <div className="d-flex align-items-center action">
                          <a
                            className="btn-icon delete-icon confirm-text"
                            href="#"
                            onClick={(e) => { e.preventDefault(); removeFromCart(item.id); }}
                          >
                            <Trash2 size={14} />
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="block-section">
                <div className="selling-info">
                  <div className="row">
                    <div className="col-12 col-sm-4">
                      <div className="input-block">
                        <label>Order Tax</label>
                        <select 
                          className="form-select"
                          value={tax}
                          onChange={(e) => setTax(parseFloat(e.target.value))}
                        >
                          <option value="5">GST 5%</option>
                          <option value="10">GST 10%</option>
                          <option value="15">GST 15%</option>
                          <option value="20">GST 20%</option>
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
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="input-block">
                        <label>Discount</label>
                        <select 
                          className="form-select"
                          value={discount}
                          onChange={(e) => setDiscount(parseFloat(e.target.value))}
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
                <div className="order-total">
                  <table className="table table-responsive table-borderless">
                    <tbody>
                      <tr>
                        <td>Sub Total</td>
                        <td className="text-end">${subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Tax (GST {tax}%)</td>
                        <td className="text-end">${taxAmount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Shipping</td>
                        <td className="text-end">${shipping.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="danger">Discount ({discount}%)</td>
                        <td className="danger text-end">-${discountAmount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td className="text-end">${total.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="block-section payment-method">
                <h6>Payment Method</h6>
                <div className="row d-flex align-items-center justify-content-center methods">
                  <div className="col-md-6 col-lg-4 item">
                    <div className="default-cover">
                      <a href="#">
                        <img src="assets/img/icons/cash-pay.svg" alt="Cash" />
                        <span>Cash</span>
                      </a>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 item">
                    <div className="default-cover">
                      <a href="#">
                        <img src="assets/img/icons/credit-card.svg" alt="Debit Card" />
                        <span>Debit Card</span>
                      </a>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 item">
                    <div className="default-cover">
                      <a href="#">
                        <img src="assets/img/icons/qr-scan.svg" alt="Scan" />
                        <span>Scan</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-grid btn-block">
                <a className="btn btn-secondary" href="#">
                  Grand Total : ${total.toFixed(2)}
                </a>
              </div>

              <div className="btn-row d-sm-flex align-items-center justify-content-between">
                <a href="#" className="btn btn-info btn-icon flex-fill">
                  <span className="me-1 d-flex align-items-center">
                    <Pause size={16} />
                  </span>
                  Hold
                </a>
                <a 
                  href="#" 
                  className="btn btn-danger btn-icon flex-fill"
                  onClick={(e) => { e.preventDefault(); clearCart(); }}
                >
                  <span className="me-1 d-flex align-items-center">
                    <Trash2 size={16} />
                  </span>
                  Void
                </a>
                <a 
                  href="#" 
                  className="btn btn-success btn-icon flex-fill"
                  onClick={(e) => { e.preventDefault(); handlePayment(); }}
                >
                  <span className="me-1 d-flex align-items-center">
                    <CreditCard size={16} />
                  </span>
                  Payment
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
