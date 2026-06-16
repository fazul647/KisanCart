// Cart.jsx - Modern E-commerce Design
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Cart.css";

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
      
      localStorage.removeItem("kisan_cart");
      setCart([]);
      setSuccess("Order placed successfully! Redirecting...");
      
      const event = new CustomEvent('showToast', {
        detail: {
          message: 'Order placed successfully!',
          type: 'success'
        }
      });
      window.dispatchEvent(event);
      
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
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryCharge + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Header */}
        <div className="cart-header">
          <div>
            <h1 className="cart-title">Shopping Cart</h1>
            <p className="cart-subtitle">{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
          </div>
          <div className="cart-actions">
            <Link to="/buyer/orders" className="cart-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              My Orders
            </Link>
            <Link to="/products" className="cart-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 8 8 12 12 16"/>
                <line x1="16" y1="12" x2="8" y2="12"/>
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert-error">
            <span>{error}</span>
            <button onClick={() => setError("")}>✕</button>
          </div>
        )}

        {success && (
          <div className="alert-success">
            <span>{success}</span>
          </div>
        )}

        {/* Empty Cart */}
        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any products to your cart yet</p>
            <Link to="/products" className="empty-cart-btn">
              Start Shopping
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Left: Cart Items */}
            <div className="cart-items-section">
              <div className="cart-items-header">
                <h3>Cart Items ({itemCount})</h3>
                <button onClick={clearCart} className="clear-cart-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  Clear Cart
                </button>
              </div>

              <div className="cart-items-list">
                {cart.map(item => (
                  <div key={item.productId} className="cart-item-card">
                    <div className="cart-item-image">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
                        }}
                      />
                    </div>
                    
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      {item.farmer && (
                        <p className="cart-item-farmer">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                          {item.farmer}
                        </p>
                      )}
                      <div className="cart-item-price">
                        <span className="current-price">₹{item.price}</span>
                        <span className="unit-price">/ {item.unit}</span>
                      </div>
                    </div>
                    
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.productId, item.quantity - 1)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                          </svg>
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.productId, item.quantity + 1)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                          </svg>
                        </button>
                      </div>
                      <div className="item-total">
                        <span className="total-label">Total:</span>
                        <span className="total-amount">₹{item.price * item.quantity}</span>
                      </div>
                      <button
                        className="remove-item-btn"
                        onClick={() => removeItem(item.productId)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="order-summary-section">
              <div className="summary-card">
                <h3>Order Summary</h3>
                
                <div className="summary-row">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Delivery Charge</span>
                  <span className={deliveryCharge > 0 ? 'charge-negative' : 'charge-free'}>
                    {deliveryCharge > 0 ? `₹${deliveryCharge}` : 'FREE'}
                  </span>
                </div>
                
                <div className="summary-row">
                  <span>Tax (5% GST)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total">
                  <span>Total Amount</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                
                {subtotal < 500 && subtotal > 0 && (
                  <div className="delivery-message warning">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Add ₹{(500 - subtotal).toFixed(2)} more for free delivery!
                  </div>
                )}
                
                {subtotal >= 500 && (
                  <div className="delivery-message success">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    You qualify for free delivery!
                  </div>
                )}
                
                <button
                  className="checkout-btn"
                  onClick={checkout}
                  disabled={loading || cart.length === 0}
                >
                  {loading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>
                
                <div className="cod-info">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
  <div>
    <strong>Cash on Delivery Only</strong>
    <p>Pay when you receive your order</p>
  </div>
</div>
                
                <div className="safe-shopping">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <div>
                    <strong>Safe & Secure Shopping</strong>
                    <p>100% Secure • Buyer Protection • 24/7 Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}