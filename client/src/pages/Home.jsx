import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [stats, setStats] = useState({
    farmers: 0,
    products: 0,
    orders: 0,
  });
  
  
  const heroImages = [
    "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    fetchStats();
  }, []);
  
  async function fetchStats() {
    try {
      const res = await fetch("http://localhost:5000/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  }
  

  return (
    <div className="home-page">

      {/* ================= HERO SECTION ================= */}
      <div 
        className="hero-section text-white py-5 position-relative overflow-hidden"
        style={{ 
          background: `linear-gradient(rgba(40, 167, 69, 0.9), rgba(25, 135, 84, 0.9)), url(${heroImages[currentImage]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          transition: 'background-image 1s ease-in-out'
        }}
      >
        {/* Background Image Indicator */}
        <div className="position-absolute bottom-3 start-50 translate-middle-x d-flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`btn btn-sm p-0 ${currentImage === index ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => setCurrentImage(index)}
              style={{ width: '10px', height: '10px', borderRadius: '50%' }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="container text-center position-relative z-1">
          <h1 className="fw-bold mb-3 display-3">
            KisanCart <span className="text-warning">🌾</span>
          </h1>
          <p className="lead mb-4 fs-4">
            Connecting Farmers directly with Buyers — Fresh, Fair & Fast
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
            <Link to="/products" className="btn btn-light btn-lg px-4 py-3 shadow-sm">
              <i className="bi bi-shop me-2"></i>
              Browse Products
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg px-4 py-3">
              <i className="bi bi-person-plus me-2"></i>
              Join Now
            </Link>
          </div>

          {/* Stats Counter */}
          <div className="row justify-content-center mt-5 pt-4">
  <div className="col-auto text-center mx-4">
    <h3 className="fw-bold">{stats.farmers}</h3>
    <p className="mb-0 small opacity-75">Farmers Registered</p>
  </div>

  <div className="col-auto text-center mx-4">
    <h3 className="fw-bold">{stats.products}</h3>
    <p className="mb-0 small opacity-75">Products Listed</p>
  </div>

  <div className="col-auto text-center mx-4">
    <h3 className="fw-bold">{stats.orders}</h3>
    <p className="mb-0 small opacity-75">Orders Placed</p>
  </div>
</div>
</div>
</div>

      {/* ================= FEATURES ================= */}
      <div className="container py-5 my-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-5 mb-3">Why Choose KisanCart?</h2>
          <p className="text-muted fs-5">
            A smart platform revolutionizing agriculture commerce
          </p>
        </div>

        <div className="row g-4">
          {[
            {
              icon: "🌾",
              title: "For Farmers",
              description: "Sell crops directly without middlemen, get fair prices, and grow your business.",
              features: ["Higher Profits", "Direct Customers", "Easy Management"]
            },
            {
              icon: "🛒",
              title: "For Buyers",
              description: "Buy fresh produce directly from verified farmers at transparent prices.",
              features: ["Fresh Produce", "Quality Assurance", "Direct Sourcing"]
            },
            {
              icon: "💬",
              title: "Direct Communication",
              description: "Chat directly with farmers for inquiries, orders, and support.",
              features: ["Instant Chat", "Build Trust", "Quick Resolutions"]
            },
            {
              icon: "📦",
              title: "Secure Delivery",
              description: "Reliable logistics with real-time tracking for safe delivery.",
              features: ["Track Orders", "Safe Handling", "On-time Delivery"]
            }
          ].map((feature, index) => (
            <div key={index} className="col-md-3">
              <div className="card h-100 shadow-lg border-0 hover-lift">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <span className="display-4">{feature.icon}</span>
                  </div>
                  <h4 className="card-title mb-3">{feature.title}</h4>
                  <p className="card-text text-muted mb-4">{feature.description}</p>
                  <ul className="list-unstyled text-start">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= HOW IT WORKS ================= */}
      <div className="bg-light py-5 my-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5 mb-3">How It Works</h2>
            <p className="text-muted fs-5">Simple steps to get started</p>
          </div>

          <div className="row g-4 text-center position-relative">
            {/* Connecting Line */}
            <div className="position-absolute top-50 start-0 end-0 d-none d-md-block">
              <div className="progress" style={{ height: '2px', backgroundColor: '#dee2e6' }}>
                <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
              </div>
            </div>

            {[
              { step: "1️⃣", title: "Register", desc: "Create your account as Farmer or Buyer", icon: "bi-person-plus" },
              { step: "2️⃣", title: "Explore", desc: "Browse through fresh farm products", icon: "bi-search" },
              { step: "3️⃣", title: "Order", desc: "Add to cart & place secure orders", icon: "bi-cart-check" },
              { step: "4️⃣", title: "Track", desc: "Monitor order status & delivery", icon: "bi-truck" }
            ].map((step, index) => (
              <div key={index} className="col-md-3">
                <div className="position-relative">
                  <div className="step-icon mx-auto mb-3 bg-white border border-3 border-success rounded-circle d-flex align-items-center justify-content-center"
                       style={{ width: '80px', height: '80px' }}>
                    <span className="display-5">{step.step}</span>
                  </div>
                  <h5 className="fw-bold mb-2">{step.title}</h5>
                  <p className="text-muted mb-0">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= TESTIMONIALS ================= */}
      <div className="container py-5 my-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-5 mb-3">What Our Users Say</h2>
        </div>

        <div className="row g-4">
          {[
            {
              name: "Ramesh Patel",
              role: "Farmer from Gujarat",
              text: "KisanCart doubled my income by eliminating middlemen. Highly recommended!",
              rating: 5
            },
            {
              name: "Priya Sharma",
              role: "Restaurant Owner",
              text: "Fresh vegetables delivered daily. Quality is consistently excellent.",
              rating: 5
            },
            {
              name: "Amit Kumar",
              role: "Organic Farmer",
              text: "The platform is easy to use and customer support is excellent.",
              rating: 4
            }
          ].map((testimonial, index) => (
            <div key={index} className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                    ))}
                  </div>
                  <p className="card-text fst-italic mb-4">"{testimonial.text}"</p>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-success d-flex align-items-center justify-content-center me-3"
                         style={{ width: '50px', height: '50px' }}>
                      <span className="text-white fs-5">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h6 className="mb-0">{testimonial.name}</h6>
                      <small className="text-muted">{testimonial.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CTA ================= */}
      <div className="container py-5 my-5 text-center">
        <div className="card border-0 shadow-lg py-5" 
             style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}>
          <div className="card-body text-white">
            <h2 className="fw-bold display-5 mb-3">
              Ready to transform your agriculture business?
            </h2>
            <p className="mb-4 fs-5 opacity-90">
              Join thousands of farmers and buyers who trust KisanCart
            </p>

            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/register" className="btn btn-light btn-lg px-5 py-3 fw-bold">
                <i className="bi bi-lightning-charge me-2"></i>
                Get Started Now
              </Link>
              <Link to="/products" className="btn btn-outline-light btn-lg px-5 py-3">
                <i className="bi bi-eye me-2"></i>
                Browse Products
              </Link>
            </div>
            
            <p className="mt-4 small opacity-75">
              No hidden fees • Cancel anytime • 24/7 Support
            </p>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h4 className="fw-bold mb-3">
                KisanCart <span className="text-success">🌾</span>
              </h4>
              <p className="text-white-50">
                Empowering farmers and buyers with direct, transparent, and fair agricultural commerce.
              </p>
            </div>
            
            <div className="col-md-2 mb-4">
              <h6 className="fw-bold mb-3">Quick Links</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/products" className="text-white-50 text-decoration-none">Products</Link></li>
                <li className="mb-2"><Link to="/about" className="text-white-50 text-decoration-none">About Us</Link></li>
                <li className="mb-2"><Link to="/contact" className="text-white-50 text-decoration-none">Contact</Link></li>
              </ul>
            </div>
            
            <div className="col-md-3 mb-4">
              <h6 className="fw-bold mb-3">For Farmers</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/register" className="text-white-50 text-decoration-none">Sell on KisanCart</Link></li>
                <li className="mb-2"><Link to="/farmer/dashboard" className="text-white-50 text-decoration-none">Farmer Dashboard</Link></li>
              </ul>
            </div>
            
            <div className="col-md-3 mb-4">
              <h6 className="fw-bold mb-3">Contact</h6>
              <ul className="list-unstyled text-white-50">
                <li className="mb-2"><i className="bi bi-envelope me-2"></i> support@kisancart.com</li>
                <li className="mb-2"><i className="bi bi-telephone me-2"></i> +91 1800-XXX-XXX</li>
                <li className="mb-2"><i className="bi bi-geo-alt me-2"></i> New Delhi, India</li>
              </ul>
            </div>
          </div>
          
          <hr className="text-white-50 my-4" />
          
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="mb-3 mb-md-0">
              <small className="text-white-50">
                © {new Date().getFullYear()} KisanCart. All rights reserved.
              </small>
            </div>
            <div className="d-flex gap-3">
              <a href="#" className="text-white-50"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white-50"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-white-50"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-white-50"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>
        </div>
      </footer>

     
    </div>
  );
}