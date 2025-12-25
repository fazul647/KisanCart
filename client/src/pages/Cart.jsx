import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const nav = useNavigate();

  /* ================= LOAD CART ================= */
  useEffect(() => {
    loadCart();
  }, []);

  function loadCart() {
    const stored = JSON.parse(localStorage.getItem("kisan_cart")) || [];
    setCart(stored);
  }

  /* ================= UPDATE QUANTITY ================= */
  function updateQty(id, qty) {
    const updated = cart.map(item =>
      item.productId === id
        ? { ...item, quantity: Math.max(1, qty) }
        : item
    );
    setCart(updated);
    localStorage.setItem("kisan_cart", JSON.stringify(updated));
  }

  /* ================= REMOVE ITEM ================= */
  function removeItem(id) {
    const itemName = cart.find(item => item.productId === id)?.name;
    if (window.confirm(`Remove "${itemName}" from cart?`)) {
      const updated = cart.filter(item => item.productId !== id);
      setCart(updated);
      localStorage.setItem("kisan_cart", JSON.stringify(updated));
      
      // Show success message
      const event = new CustomEvent('showToast', {
        detail: {
          message: 'Item removed from cart',
          type: 'info'
        }
      });
      window.dispatchEvent(event);
    }
  }

  /* ================= CLEAR CART ================= */
  function clearCart() {
    if (cart.length === 0) return;
    if (window.confirm("Clear all items from cart?")) {
      setCart([]);
      localStorage.removeItem("kisan_cart");
      
      const event = new CustomEvent('showToast', {
        detail: {
          message: 'Cart cleared',
          type: 'info'
        }
      });
      window.dispatchEvent(event);
    }
  }

  /* ================= CHECKOUT ================= */
  async function checkout() {
    const user = JSON.parse(localStorage.getItem("kisan_user"));
    
    if (!user) {
      setError("Please login to checkout");
      setTimeout(() => nav("/login"), 1500);
      return;
    }

    if (user.role !== "buyer") {
      setError("Only buyers can place orders");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        cart: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      const res = await API.post("/orders/checkout", payload);
      
      // SUCCESS
      localStorage.removeItem("kisan_cart");
      setCart([]);
      setSuccess("Order placed successfully! Redirecting...");
      
      // Show success toast
      const event = new CustomEvent('showToast', {
        detail: {
          message: 'Order placed successfully!',
          type: 'success'
        }
      });
      window.dispatchEvent(event);
      
      // Redirect to orders page
      setTimeout(() => {
        nav("/buyer/orders");
      }, 2000);
      
    } catch (err) {
      console.error("Checkout failed:", err);
      const errorMsg = err?.response?.data?.message || 
                      err?.response?.data?.error || 
                      "Checkout failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  /* ================= CALCULATIONS ================= */
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryCharge = subtotal > 0 && subtotal < 500 ? 50 : 0;
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + deliveryCharge + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container mt-4 mb-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-2">My Shopping Cart</h2>
          <p className="text-muted">
            {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
          </p>
        </div>
        
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() => nav("/buyer/orders")}
          >
            <i className="bi bi-box-seam me-2"></i>
            My Orders
          </button>
          <Link to="/products" className="btn btn-outline-success">
            <i className="bi bi-arrow-left me-2"></i>
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {/* SUCCESS ALERT */}
      {success && (
        <div className="alert alert-success alert-dismissible fade show mb-4">
          {success}
        </div>
      )}

      {cart.length === 0 ? (
        /* EMPTY CART STATE */
        <div className="text-center py-5">
          <div className="display-1 text-muted mb-3">🛒</div>
          <h4 className="mb-3">Your cart is empty</h4>
          <p className="text-muted mb-4">
            Add some fresh farm products to get started!
          </p>
          <Link to="/products" className="btn btn-success btn-lg">
            <i className="bi bi-shop me-2"></i>
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="row">
          {/* CART ITEMS COLUMN */}
          <div className="col-lg-8">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Cart Items ({itemCount})</h5>
                <button 
                  onClick={clearCart}
                  className="btn btn-sm btn-outline-danger"
                >
                  <i className="bi bi-trash me-1"></i>
                  Clear Cart
                </button>
              </div>
              
              <div className="card-body p-0">
                {cart.map(item => (
                  <div key={item.productId} className="cart-item p-4 border-bottom">
                    <div className="row align-items-center">
                      {/* PRODUCT IMAGE */}
                      <div className="col-md-2">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          className="img-fluid rounded"
                          style={{ width: "100px", height: "100px", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
                          }}
                        />
                      </div>
                      
                      {/* PRODUCT DETAILS */}
                      <div className="col-md-4">
                        <h6 className="fw-bold mb-1">{item.name}</h6>
                        {item.farmer && (
                          <p className="text-muted small mb-1">
                            <i className="bi bi-person me-1"></i>
                            {item.farmer}
                          </p>
                        )}
                        <p className="text-success fw-bold mb-0">
                          ₹{item.price} / {item.unit}
                        </p>
                      </div>
                      
                      {/* QUANTITY CONTROLS */}
                      <div className="col-md-3">
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => updateQty(item.productId, item.quantity - 1)}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={e => updateQty(item.productId, Number(e.target.value))}
                            className="form-control form-control-sm text-center mx-2"
                            style={{ width: "70px" }}
                          />
                          
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => updateQty(item.productId, item.quantity + 1)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                      
                      {/* ITEM TOTAL */}
                      <div className="col-md-2 text-center">
                        <h6 className="fw-bold">₹{item.price * item.quantity}</h6>
                        <p className="text-muted small mb-0">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      
                      {/* REMOVE BUTTON */}
                      <div className="col-md-1 text-end">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeItem(item.productId)}
                          title="Remove item"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                    
                   
                  </div>
                ))}
              </div>
            </div>
            
            {/* SHIPPING INFO */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="mb-3">
                  <i className="bi bi-truck text-success me-2"></i>
                  Shipping Information
                </h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="small text-muted mb-2">Delivery Address</h6>
                    <p className="mb-0">
                      <i className="bi bi-house-door me-2"></i>
                      Delivery address will be taken from your profile
                    </p>
                    
                  </div>
                  <div className="col-md-6">
                    <h6 className="small text-muted mb-2">Delivery Time</h6>
                    <p className="mb-0">
                      <i className="bi bi-clock me-2"></i>
                      Estimated delivery: 2-4 days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* ORDER SUMMARY COLUMN */}
          <div className="col-lg-4">
            <div className="card shadow-sm sticky-top" style={{ top: "20px" }}>
              <div className="card-header bg-white">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              
              <div className="card-body">
                {/* PRICE BREAKDOWN */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Delivery Charge</span>
                    <span className={deliveryCharge > 0 ? 'text-danger' : 'text-success'}>
                      {deliveryCharge > 0 ? `₹${deliveryCharge}` : 'FREE'}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax (5% GST)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-bold">Total Amount</span>
                    <span className="fw-bold fs-5 text-success">₹{total.toFixed(2)}</span>
                  </div>
                  
                  {/* FREE DELIVERY MESSAGE */}
                  {subtotal < 500 && subtotal > 0 && (
                    <div className="alert alert-warning p-2 small mb-3">
                      <i className="bi bi-info-circle me-1"></i>
                      Add ₹{(500 - subtotal).toFixed(2)} more for free delivery!
                    </div>
                  )}
                  
                  {subtotal >= 500 && (
                    <div className="alert alert-success p-2 small mb-3">
                      <i className="bi bi-check-circle me-1"></i>
                      You qualify for free delivery!
                    </div>
                  )}
                </div>
                
                {/* CHECKOUT BUTTON */}
                <button
                  className="btn btn-success w-100 py-3 fw-bold"
                  onClick={checkout}
                  disabled={loading || cart.length === 0}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-lock me-2"></i>
                      Proceed to Checkout
                      <br />
                      <small className="fw-normal">Pay ₹{total.toFixed(2)}</small>
                    </>
                  )}
                </button>
                
                <p>Cash on Delivery </p>
                
                {/* SAFE SHOPPING */}
                <div className="mt-4 pt-3 border-top">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-shield-check text-success fs-4 me-3"></i>
                    <div>
                      <small className="fw-bold">Safe Shopping</small>
                      <p className="small text-muted mb-0">
                        100% Secure • Buyer Protection • 24/7 Support
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}