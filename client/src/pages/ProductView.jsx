import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function ProductView() {
  const { id } = useParams();
  const nav = useNavigate();

  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  // message modal
  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState("");

  const user = JSON.parse(localStorage.getItem("kisan_user"));

  /* ---------------- ADD TO CART ---------------- */
  function addToCart(p) {
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
    alert("Added to cart");
  }

  /* ---------------- SEND MESSAGE ---------------- */
  async function sendMessage() {
    if (!msgText.trim()) {
      alert("Type a message");
      return;
    }

    try {
      await API.post("/messages/send", {
        receiverId: product.farmer._id,
        productId: product._id,
        text: msgText,
      });

      alert("Message sent");
      setMsgText("");
      setShowMsg(false);
    } catch (err) {
      alert("Failed to send message");
    }
  }

  /* ---------------- LOAD RECOMMENDATIONS ---------------- */
  async function loadRecommendations(prod) {
    try {
      const res = await API.get("/crops/recommendations", {
        params: {
          category: prod.category,
          excludeId: prod._id
        }
      });

      console.log("RECOMMENDED PRODUCTS:", res.data.products);
      setRecommended(res.data.products || []);
    } catch (err) {
      console.error("Failed to load recommendations", err);
    }
  }

  /* ---------------- LOAD PRODUCT ---------------- */
  async function load() {
    try {
      const res = await API.get(`/crops/${id}`);
      const prod = res.data.product;

      setProduct(prod);
      loadRecommendations(prod);
    } catch (err) {
      console.error("Failed to load product:", err);
      nav("/products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  if (loading) {
    return <h3 className="text-center mt-4">Loading...</h3>;
  }

  if (!product) return null;

  const mainImg =
    product.productImages?.[0] ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

  return (
    <div className="container mt-4">

      {/* MAIN PRODUCT */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card">
            <img
              src={mainImg}
              alt={product.productName}
              className="card-img-top"
              style={{ height: "520px", objectFit: "cover" }}
            />
          </div>
        </div>

        <div className="col-md-6">
          <h2 className="fw-bold">{product.productName}</h2>
          <p className="text-muted">{product.category}</p>

          <h4 className="text-success">
            ₹{product.price} / {product.unit}
          </h4>

          <p className="mt-3">
            {product.description || "No description provided."}
          </p>

          <p><strong>Available:</strong> {product.quantityAvailable}</p>

          {/* FARMER INFO */}
          {user?.role === "buyer" && (
            <>
              <hr />
              <h5>Farmer</h5>
              <p className="mb-1"><strong>{product.farmer?.name}</strong></p>
              <p className="mb-1">📞 {product.farmer?.phone}</p>
              <p className="mb-1">✉️ {product.farmer?.email}</p>
            </>
          )}

          {/* ACTION BUTTONS */}
          <div className="d-flex gap-2 flex-wrap mt-3">
            {user?.role === "buyer" && (
              <>
                <button
                  className="btn btn-outline-success"
                  onClick={() => setShowMsg(true)}
                >
                  💬 Message Farmer
                </button>

                <button
                  className="btn btn-success"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </>
            )}

            <button
              className="btn btn-outline-secondary"
              onClick={() => nav(-1)}
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>

      {/* MESSAGE MODAL */}
      {showMsg && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Message {product.farmer?.name}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowMsg(false)}
                />
              </div>

              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Type your message..."
                  value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowMsg(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={sendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECOMMENDED PRODUCTS (SAME CARD AS PRODUCTS PAGE) */}
      {user?.role === "buyer" && recommended.length > 0 && (
        <div className="mt-5">
          <h4 className="fw-bold mb-3">Recommended Products</h4>

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {recommended.map(p => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
