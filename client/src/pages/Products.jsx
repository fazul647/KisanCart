import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function Products() {
  console.log("BUYER PRODUCTS PAGE LOADED");

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceSort, setPriceSort] = useState("default");
  const [categories, setCategories] = useState([]);
  const [addingToCart, setAddingToCart] = useState(null);

  /* ---------------- ADD TO CART ---------------- */
  const addToCart = (p) => {
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
    }, 500);
  };

  /* ---------------- LOAD PRODUCTS ---------------- */
  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/crops/all");
      const list = res.data.products || [];

      setProducts(list);
      setFiltered(list);

      const uniqueCategories = [
        ...new Set(list.map(p => p.category).filter(Boolean))
      ];
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

  /* ---------------- FILTER & SORT ---------------- */
  useEffect(() => {
    let result = [...products];

    const term = q.trim().toLowerCase();
    if (term) {
      result = result.filter(p =>
        (p.productName || "").toLowerCase().includes(term) ||
        (p.category || "").toLowerCase().includes(term) ||
        (p.description || "").toLowerCase().includes(term) ||
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
    } else if (priceSort === "new") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFiltered(result);
  }, [q, categoryFilter, priceSort, products]);

  return (
    <div className="container mt-4 mb-5">

      {/* HEADER */}
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h1 className="fw-bold">Fresh Farm Products</h1>
          <p className="text-muted">Direct from farmers to your doorstep</p>
        </div>
        <div className="col-md-6 text-md-end">
          <Link to="/cart" className="btn btn-outline-success">
            View Cart
          </Link>
        </div>
      </div>

      {/* ERROR */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* SEARCH & FILTER */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search products..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={priceSort}
            onChange={e => setPriceSort(e.target.value)}
          >
            <option value="default">Sort by</option>
            <option value="new">Newest</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-success"></div>
        </div>
      )}

      {/* PRODUCTS GRID (IMPORTANT PART) */}
      {!loading && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 align-items-stretch">

          {filtered.map(p => (
            <ProductCard
              key={p._id}
              p={p}
              addToCart={addToCart}
              addingToCart={addingToCart}
            />
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <div className="text-center mt-5">
          <h4>No products found</h4>
        </div>
      )}
    </div>
  );
}
