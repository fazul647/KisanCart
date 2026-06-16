import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import "../styles/ProductView.css";

export default function ProductView() {
  const { id } = useParams();
  const nav = useNavigate();

  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const user = JSON.parse(localStorage.getItem("kisan_user"));

  function addToCart(p) {
    setAddingToCart(true);
    const cart = JSON.parse(localStorage.getItem("kisan_cart")) || [];
    const existing = cart.find(item => item.productId === p._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: p._id,
        name: p.productName,
        price: p.price,
        unit: p.unit,
        image: p.productImages?.[0],
        quantity: 1
      });
    }

    localStorage.setItem("kisan_cart", JSON.stringify(cart));
    
    setTimeout(() => {
      setAddingToCart(false);
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: { message: `${p.productName} added to cart`, type: "success" }
        })
      );
      nav("/cart");
    }, 500);
  }

  async function sendMessage() {
    if (!msgText.trim()) return;
    
    setSendingMessage(true);
    try {
      await API.post("/messages/send", {
        receiverId: product.farmer._id,
        productId: product._id,
        text: msgText,
      });

      setMsgText("");
      setShowMsg(false);
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: { message: "Message sent successfully", type: "success" }
        })
      );
    } catch (err) {
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: { message: "Failed to send message", type: "error" }
        })
      );
    } finally {
      setSendingMessage(false);
    }
  }

  async function loadRecommendations(prod) {
    try {
      const res = await API.get("/crops/recommendations", {
        params: {
          category: prod.category,
          excludeId: prod._id
        }
      });
      setRecommended(res.data.products || []);
    } catch (err) {
      console.error("Failed to load recommendations", err);
    }
  }

  async function load() {
    try {
      const res = await API.get(`/crops/${id}`);
      const prod = res.data.product;
      setProduct(prod);
      if (user?.role === "buyer") {
        loadRecommendations(prod);
      }
    } catch (err) {
      console.error("Failed to load product:", err);
      nav("/products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="productview-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) return null;

  const images = product.productImages?.length ? product.productImages : [];
  const mainImage = images[selectedImage] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

  return (
    <div className="productview-page">
      <div className="productview-container">
        {/* Back Button */}
        <button className="back-button" onClick={() => nav(-1)}>
          ← Back to Products
        </button>

        {/* Main Product Section */}
        <div className="productview-main">
          {/* Image Gallery */}
          <div className="productview-gallery">
            <div className="main-image">
              <img src={mainImage} alt={product.productName} />
            </div>
            {images.length > 1 && (
              <div className="thumbnail-list">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="productview-info">
            <div className="product-category">{product.category}</div>
            <h1 className="product-title">{product.productName}</h1>
            
            <div className="product-price-section">
              <span className="product-price">₹{product.price}</span>
              {product.unit && <span className="product-unit">/ {product.unit}</span>}
            </div>

            <div className="product-stock">
              <span className={`stock-badge ${product.quantityAvailable > 10 ? 'in-stock' : product.quantityAvailable > 0 ? 'low-stock' : 'out-stock'}`}>
                {product.quantityAvailable > 10 ? 'In Stock' : 
                 product.quantityAvailable > 0 ? `Only ${product.quantityAvailable} left` : 'Out of Stock'}
              </span>
            </div>

            {product.description && (
              <div className="product-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            )}

            {/* Farmer Info */}
            {user?.role === "buyer" && product.farmer && (
              <div className="farmer-card">
                <h3>Seller Information</h3>
                <div className="farmer-details">
                  <div className="farmer-icon">👨‍🌾</div>
                  <div className="farmer-info">
                    <p className="farmer-name">{product.farmer.name}</p>
                    <p className="farmer-contact">📞 {product.farmer.phone}</p>
                    <p className="farmer-contact">✉️ {product.farmer.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {user?.role === "buyer" && (
              <div className="action-buttons">
                <button 
                  className="btn-message"
                  onClick={() => setShowMsg(true)}
                >
                  💬 Message Farmer
                </button>
                <button 
                  className="btn-cart"
                  onClick={() => addToCart(product)}
                  disabled={addingToCart || product.quantityAvailable === 0}
                >
                  {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Products */}
{user?.role === "buyer" && (
  <div className="recommended-section">
    <div className="section-header">
      <h2>You May Also Like</h2>
      <p>Products you might be interested in</p>
    </div>

    {recommended.length === 0 ? (
      <p style={{ padding: "20px", textAlign: "center" }}>
        No recommendations available
      </p>
    ) : (
      <div className="recommended-grid">
        {recommended.map(p => (
          <ProductCard key={p._id} p={p} />
        ))}
      </div>
    )}
  </div>
)}  </div>

      {/* Message Modal */}
      {showMsg && (
        <div className="modal-overlay" onClick={() => setShowMsg(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Message {product.farmer?.name}</h3>
              <button className="modal-close" onClick={() => setShowMsg(false)}>×</button>
            </div>
            <div className="modal-body">
              <textarea
                className="message-input"
                rows={5}
                placeholder="Type your message here..."
                value={msgText}
                onChange={e => setMsgText(e.target.value)}
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowMsg(false)}>
                Cancel
              </button>
              <button 
                className="btn-send" 
                onClick={sendMessage}
                disabled={sendingMessage || !msgText.trim()}
              >
                {sendingMessage ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}