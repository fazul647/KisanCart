import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function EditProduct() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    API.get(`/crops/${id}`)
      .then(res => setForm(res.data.product))
      .catch(() => alert("Failed to load product"));
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function updateProduct(e) {
    e.preventDefault();
    try {
      await API.put(`/crops/${id}`, {
        productName: form.productName,
        price: form.price,
        quantityAvailable: form.quantityAvailable,
        description: form.description,
        availableUntil: form.availableUntil
      });

      alert("Product updated");
      nav("/farmer/products");
    } catch (err) {
      alert("Failed to update product");
    }
  }

  if (!form) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">Edit Product</h2>

      <form onSubmit={updateProduct}>
        <input
          className="form-control mb-2"
          name="productName"
          value={form.productName}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          className="form-control mb-2"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          className="form-control mb-2"
          name="quantityAvailable"
          value={form.quantityAvailable}
          onChange={handleChange}
          required
        />

        <textarea
          className="form-control mb-2"
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="date"
          className="form-control mb-3"
          name="availableUntil"
          value={form.availableUntil?.substring(0,10)}
          onChange={handleChange}
        />

        <button className="btn btn-success">Update Product</button>
      </form>
    </div>
  );
}
