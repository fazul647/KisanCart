import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "../styles/Home.css";

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [stats, setStats] = useState({
    farmers: 0,
    products: 0,
    orders: 0,
  });
  const [animatedStats, setAnimatedStats] = useState({
    farmers: 0,
    products: 0,
    orders: 0,
  });

  const heroImages = [
    "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ];

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch stats
  useEffect(() => {
    fetchStats();
  }, []);

  // Animate stats when they load
  useEffect(() => {
    if (stats.farmers > 0) {
      animateNumber("farmers", stats.farmers);
      animateNumber("products", stats.products);
      animateNumber("orders", stats.orders);
    }
  }, [stats]);

  const animateNumber = (key, target) => {
    let start = 0;
    const duration = 1500;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setAnimatedStats((prev) => ({ ...prev, [key]: target }));
        clearInterval(timer);
      } else {
        setAnimatedStats((prev) => ({ ...prev, [key]: Math.floor(start) }));
      }
    }, stepTime);
  };

  async function fetchStats() {
    try {
      const res = await API.get("/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats", err);
      // Set demo data for testing if API fails
      setStats({
        farmers: 1250,
        products: 3420,
        orders: 8920,
      });
    }
  }

  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5)), url(${heroImages[currentImage]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="home-page">
      {/* ================= HERO SECTION ================= */}
      <div className="hero-section" style={heroStyle}>
        <div className="hero-overlay"></div>
        
        {/* Slide Indicators */}
        <div className="slide-indicators">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`slide-dot ${currentImage === index ? 'active' : ''}`}
              onClick={() => setCurrentImage(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            KisanCart <span className="hero-icon">🌾</span>
          </h1>
          <p className="hero-subtitle">
            Connecting Farmers directly with Buyers — Fresh, Fair & Fast
          </p>

          <div className="hero-buttons">
            
            <Link to="/products" className="btn btn-primary btn-large">
              <i className="bi bi-shop me-2"></i>
              Browse Products
              
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-large">
              <i className="bi bi-person-plus me-2"></i>
              Join Now
            </Link>
          </div>

          {/* Stats Counter */}
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-number">{animatedStats.farmers.toLocaleString()}+</div>
              <div className="stat-label">Farmers Registered</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{animatedStats.products.toLocaleString()}+</div>
              <div className="stat-label">Products Listed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{animatedStats.orders.toLocaleString()}+</div>
              <div className="stat-label">Orders Placed</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Why Choose Us</span>
            <h2 className="section-title">Why Choose KisanCart?</h2>
            <p className="section-subtitle">A smart platform revolutionizing agriculture commerce</p>
          </div>

          <div className="features-grid">
            {[
              {
                icon: "🌾",
                title: "For Farmers",
                description: "Sell crops directly without middlemen, get fair prices, and grow your business.",
                features: ["Higher Profits", "Direct Customers", "Easy Management"],
                color: "#f39c12"
              },
              {
                icon: "🛒",
                title: "For Buyers",
                description: "Buy fresh produce directly from verified farmers at transparent prices.",
                features: ["Fresh Produce", "Quality Assurance", "Direct Sourcing"],
                color: "#2ecc71"
              },
              {
                icon: "💬",
                title: "Direct Communication",
                description: "Chat directly with farmers for inquiries, orders, and support.",
                features: ["Instant Chat", "Build Trust", "Quick Resolutions"],
                color: "#3498db"
              },
              {
                icon: "📦",
                title: "Secure Delivery",
                description: "Reliable logistics with real-time tracking for safe delivery.",
                features: ["Track Orders", "Safe Handling", "On-time Delivery"],
                color: "#e74c3c"
              },
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-border" style={{ background: feature.color }}></div>
                <div className="feature-icon-wrapper" style={{ background: `${feature.color}20` }}>
                  <span className="feature-icon">{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <ul className="feature-list">
                  {feature.features.map((item, idx) => (
                    <li key={idx}>
                      <i className="bi bi-check-circle-fill"></i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= HOW IT WORKS ================= */}
      <div className="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-badge info">Simple Process</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Simple steps to get started</p>
          </div>

          <div className="steps-grid">
            {[
              { step: "01", title: "Register", desc: "Create your account as Farmer or Buyer", icon: "bi-person-plus" },
              { step: "02", title: "Explore", desc: "Browse through fresh farm products", icon: "bi-search" },
              { step: "03", title: "Order", desc: "Add to cart & place secure orders", icon: "bi-cart-check" },
              { step: "04", title: "Track", desc: "Monitor order status & delivery", icon: "bi-truck" },
            ].map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.step}</div>
                <div className="step-icon-badge">
                  <i className={`${step.icon}`}></i>
                </div>
                <h4 className="step-title">{step.title}</h4>
                <p className="step-description">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= TESTIMONIALS ================= */}
      <div className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge warning">Testimonials</span>
            <h2 className="section-title">What Our Users Say</h2>
          </div>

          <div className="testimonials-grid">
            {[
              {
                name: "Ramesh Patel",
                role: "Farmer from Gujarat",
                text: "KisanCart doubled my income by eliminating middlemen. Highly recommended!",
                rating: 5,
                image: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                name: "Priya Sharma",
                role: "Restaurant Owner",
                text: "Fresh vegetables delivered daily. Quality is consistently excellent.",
                rating: 5,
                image: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                name: "Amit Kumar",
                role: "Organic Farmer",
                text: "The platform is easy to use and customer support is excellent.",
                rating: 4,
                image: "https://randomuser.me/api/portraits/men/75.jpg"
              },
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`bi bi-star${i < testimonial.rating ? "-fill" : ""}`}></i>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <img src={testimonial.image} alt={testimonial.name} />
                  <div>
                    <h6>{testimonial.name}</h6>
                    <small>{testimonial.role}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= CTA ================= */}
      <div className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-title">Ready to transform your agriculture business?</h2>
            <p className="cta-subtitle">Join thousands of farmers and buyers who trust KisanCart</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-light btn-large">
                <i className="bi bi-lightning-charge me-2"></i>
                Get Started Now
              </Link>
              <Link to="/products" className="btn btn-outline-light btn-large">
                <i className="bi bi-eye me-2"></i>
                Browse Products
              </Link>
            </div>
            <p className="cta-footer">
              <i className="bi bi-shield-check me-1"></i> No hidden fees • Cancel anytime • 24/7 Support
            </p>
          </div>
        </div>
      </div>

      {/* ================= SIMPLE FOOTER ================= */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>KisanCart <span>🌾</span></h3>
              <p>Empowering farmers and buyers with direct, transparent, and fair agricultural commerce.</p>
              <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">📘</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📷</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">🔗</a>
        </div>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>For Farmers</h4>
              <ul>
                <li><Link to="/register">Sell on KisanCart</Link></li>
                <li><Link to="/dashboard">Farmer Dashboard</Link></li>
              </ul>
            </div>
            <div className="footer-contact">
              <h4>Contact</h4>
              <ul>
                <li><i className="bi bi-envelope"></i> support@kisancart.com</li>
                <li><i className="bi bi-telephone"></i> +91 1800-XXX-XXX</li>
                <li><i className="bi bi-geo-alt"></i> New Delhi, India</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} KisanCart. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}