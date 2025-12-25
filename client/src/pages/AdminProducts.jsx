import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/admin/products")
      .then(res => setProducts(res.data.products))
      .catch(() => alert("Failed to load products"));
  }, []);

  async function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;

    await API.delete(`/admin/products/${id}`);
    setProducts(p => p.filter(x => x._id !== id));
  }

  return (
    <div className="container mt-4">
      <h3>All Products</h3>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Farmer</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.productName}</td>
              <td>{p.farmer?.name}</td>
              <td>₹{p.price}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteProduct(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
