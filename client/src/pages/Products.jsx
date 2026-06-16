// Products.jsx - Clean Modern Redesign with Product View Navigation
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/Product.css";


export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceSort, setPriceSort] = useState("default");
  const [categories, setCategories] = useState([]);
  const [addingToCart, setAddingToCart] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const addToCart = (p, e) => {
    if (e) e.stopPropagation();
    setAddingToCart(p._id);
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
        farmer: p.farmer?.name || "Farmer",
        quantity: 1,
        availableUntil: p.availableUntil
      });
    }

    localStorage.setItem("kisan_cart", JSON.stringify(cart));

    setTimeout(() => {
      setAddingToCart(null);
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: { message: `${p.productName} added to cart`, type: "success" }
        })
      );
       navigate("/cart");
    }, 500);
  };

  const viewProductDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/crops/all");
      const list = res.data.products || [];
      setProducts(list);
      setFiltered(list);

      const uniqueCategories = [...new Set(list.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let result = [...products];
    const term = q.trim().toLowerCase();
    if (term) {
      result = result.filter(p =>
        (p.productName || "").toLowerCase().includes(term) ||
        (p.category || "").toLowerCase().includes(term) ||
        (p.farmer?.name || "").toLowerCase().includes(term)
      );
    }
    if (categoryFilter !== "all") {
      result = result.filter(p => p.category === categoryFilter);
    }
    if (priceSort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === "high") {
      result.sort((a, b) => b.price - a.price);
    }
    setFiltered(result);
  }, [q, categoryFilter, priceSort, products]);

  const resetFilters = () => {
    setQ("");
    setCategoryFilter("all");
    setPriceSort("default");
  };

  return (
    <div className="products-page">
      {/* Simple Hero */}
      <div className="page-header">
        <div className="header-content">
          <h1>Fresh Produce</h1>
          <p>Direct from farmers to your table</p>
        </div>
      </div>

      <div className="products-wrapper">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="search-section">
            <div className="search-box">
              <svg className="search-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </div>
          </div>

          <div className="controls-section">
            <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="4" y1="21" x2="4" y2="14"/>
                <line x1="4" y1="10" x2="4" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/>
                <line x1="20" y1="12" x2="20" y2="3"/>
                <line x1="2" y1="14" x2="6" y2="14"/>
                <line x1="10" y1="12" x2="14" y2="12"/>
                <line x1="18" y1="16" x2="22" y2="16"/>
              </svg>
              Filters
            </button>

            <select value={priceSort} onChange={e => setPriceSort(e.target.value)}>
              <option value="default">Sort by</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-grid">
              <div className="filter-group">
                <label>Categories</label>
                <div className="category-buttons">
                  <button
                    className={categoryFilter === "all" ? "active" : ""}
                    onClick={() => setCategoryFilter("all")}
                  >
                    All
                  </button>
                  {categories.map(c => (
                    <button
                      key={c}
                      className={categoryFilter === c ? "active" : ""}
                      onClick={() => setCategoryFilter(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="filter-actions">
              <button onClick={resetFilters}>Reset Filters</button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="results-info">
          <span>{filtered.length} products found</span>
        </div>

        {/* Error */}
        {error && (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={loadProducts}>Try Again</button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-state">
            <div className="loader"></div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="products-grid">
            {filtered.map(product => (
              <div key={product._id} className="product-item">
                <div className="product-image" onClick={() => viewProductDetails(product._id)}>
                  {product.productImages?.[0] ? (
                    <img src={product.productImages[0]} alt={product.productName} />
                  ) : (
                    <div className="image-placeholder">🌾</div>
                  )}
                  {product.quantity < 10 && (
                    <span className="stock-warning">Low stock</span>
                  )}
                </div>

                <div className="product-body">
                  <h3 onClick={() => viewProductDetails(product._id)}>{product.productName}</h3>
                  <p className="farmer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    {product.farmer?.name || "Local Farmer"}
                  </p>
                  <div className="price-row">
                    <span className="price">₹{product.price}</span>
                    {product.unit && <span className="unit">/ {product.unit}</span>}
                  </div>
                  {product.category && (
                    <span className="category-tag">{product.category}</span>
                  )}
                </div>

                <div className="product-buttons">
                  <button
                    className="view-details-btn"
                    onClick={() => viewProductDetails(product._id)}
                  >
                    View Details
                  </button>
                  <button
                    className="cart-btn"
                    onClick={(e) => addToCart(product, e)}
                    disabled={addingToCart === product._id}
                  >
                    {addingToCart === product._id ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🌱</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
            <button onClick={resetFilters}>Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}