import { Link } from "react-router-dom";
import "../index.css";
export default function ProductCard({ p, addToCart, addingToCart }) {
  const isAvailable = p.quantityAvailable > 0;

  const getAvailabilityText = () => {
    if (p.quantityAvailable <= 0) return "Out of Stock";
    if (p.quantityAvailable <= 10) return "Low Stock";
    return "In Stock";
  };

  const getAvailabilityColor = () => {
    if (p.quantityAvailable <= 0) return "danger";
    if (p.quantityAvailable <= 10) return "warning";
    return "success";
  };

  return (
    <div className="col">
     <div className="card h-100 shadow-sm border-0 product-card d-flex flex-column">

        {/* IMAGE */}
        <div className="position-relative" style={{ height: "200px", overflow: "hidden" }}>
          <img
            src={p.productImages?.[0] || "/placeholder.png"}
            className="product-img"
            alt={p.productName}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
            }}
          />

          <div className="position-absolute top-0 end-0 m-2">
            <span className={`badge bg-${getAvailabilityColor()}`}>
              {getAvailabilityText()}
            </span>
          </div>

          {p.farmer?.name && (
            <div className="position-absolute bottom-0 start-0 m-2">
              <span className="badge bg-dark bg-opacity-75">
                {p.farmer.name}
              </span>
            </div>
          )}
        </div>

        {/* BODY */}
        <div className="card-body d-flex flex-column flex-grow-1">

          <span className="badge bg-light text-dark border mb-2">
            {p.category}
          </span>

          <h5 className="card-title">{p.productName}</h5>

          <p className="text-muted small">

            {p.description?.substring(0, 80) || "Fresh farm produce"}
          </p>

          <div className="d-flex justify-content-between">
            <span>Price:</span>
            <span className="fw-bold text-success">
              ₹{p.price}/{p.unit}
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="card-footer bg-white border-0">

          <div className="d-grid gap-2">
            <Link
              to={`/products/${p._id}`}
              className="btn btn-outline-success"
            >
              View Details
            </Link>

            {addToCart && (
              <button
                className="btn btn-success"
                disabled={!isAvailable || addingToCart === p._id}
                onClick={() => addToCart(p)}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
