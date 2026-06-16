// Home.jsx - IMPROVED UI/UX (All existing logic preserved, no TypeScript)
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "../styles/Home.css"; // Enhanced CSS file (create this)

export default function Home() {
  // ========== EXISTING LOGIC - COMPLETELY UNCHANGED ==========
  const [currentImage, setCurrentImage] = useState(0);
  const [categoryStats, setCategoryStats] = useState({});
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

  // REMOVED TypeScript annotations - now pure JavaScript
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
    backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%), url(${heroImages[currentImage]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: 'background-image 1s ease-in-out',
  };

  // ========== IMPROVED JSX STRUCTURE ==========
  return (
    <div className="home-page">
      {/* HERO SECTION - Enhanced with better overlay and animations */}
      <section className="hero-section" style={heroStyle}>
        <div className="hero-overlay"></div>
        
        {/* Slide Indicators - Improved design */}
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

        <div className="hero-container">
          <div className="hero-content animate-fade-in-up">
            <div className="hero-badge">
              <span className="badge-pulse">🌾 India's Most Trusted Agri-Tech Platform</span>
            </div>
            <h1 className="hero-title">
              Fresh From Farm
              <span className="hero-title-gradient"> Direct to Your Door</span>
            </h1>
            <p className="hero-subtitle">
              Empowering farmers and connecting them directly with buyers — 
              no middlemen, fair prices, and 100% fresh produce.
            </p>

            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary btn-large">
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7h-4.18A3 3 0 0 0 13 5h-2a3 3 0 0 0-2.82 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z"/>
                  <path d="M8 12h8"/>
                  <path d="M12 8v8"/>
                </svg>
                Browse Products
              </Link>
              <Link to="/register" className="btn btn-outline-light btn-large">
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Join as Farmer
              </Link>
            </div>

            {/* Stats Counter - Enhanced with better styling */}
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-icon">👨‍🌾</div>
                <div className="stat-number">{animatedStats.farmers.toLocaleString()}+</div>
                <div className="stat-label">Farmers Registered</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-card">
                <div className="stat-icon">🥬</div>
                <div className="stat-number">{animatedStats.products.toLocaleString()}+</div>
                <div className="stat-label">Products Listed</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-number">{animatedStats.orders.toLocaleString()}+</div>
                <div className="stat-label">Orders Completed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - New section with modern cards */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Why Choose Us</span>
            <h2 className="section-title">Better Farming, Better Future</h2>
            <p className="section-subtitle">
              We're revolutionizing the agricultural supply chain with transparency and technology
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🚜</span>
              </div>
              <h3 className="feature-title">Direct Farmer Connection</h3>
              <p className="feature-description">
                Buy directly from local farmers, eliminating middlemen and ensuring fair prices for everyone.
              </p>
              <div className="feature-tag">Zero Commission</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🌿</span>
              </div>
              <h3 className="feature-title">100% Fresh Produce</h3>
              <p className="feature-description">
                Farm-fresh vegetables, fruits, and grains delivered within 24 hours of harvest.
              </p>
              <div className="feature-tag">Quality Guaranteed</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">💰</span>
              </div>
              <h3 className="feature-title">Fair Pricing</h3>
              <p className="feature-description">
                Transparent pricing with real-time market rates. No hidden costs or unexpected fees.
              </p>
              <div className="feature-tag">Best Price Promise</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🚚</span>
              </div>
              <h3 className="feature-title">Fast Delivery</h3>
              <p className="feature-description">
                Dedicated logistics network ensuring quick and safe delivery of perishable goods.
              </p>
              <div className="feature-tag">Free Shipping*</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION - 3-step flow */}
      <section className="howitworks-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Simple Process</span>
            <h2 className="section-title">How KisanCart Works</h2>
            <p className="section-subtitle">Get started in three easy steps</p>
          </div>

          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-icon">📝</div>
              <h3 className="step-title">Farmer Lists Products</h3>
              <p className="step-description">
                Farmers register and list their fresh produce with real photos and competitive prices
              </p>
              <div className="step-connector"></div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-icon">🔍</div>
              <h3 className="step-title">Buyer Browses & Orders</h3>
              <p className="step-description">
                Buyers explore categories, compare prices, and place orders directly with farmers
              </p>
              <div className="step-connector"></div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-icon">✅</div>
              <h3 className="step-title">Order Delivered</h3>
              <p className="step-description">
                Secure payment, tracked delivery, and quality verification upon arrival
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION - Quick access */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Shop by Category</span>
            <h2 className="section-title">Explore Our Categories</h2>
            <p className="section-subtitle">Find exactly what you're looking for</p>
          </div>

          <div className="categories-grid">
            <Link to="/products?category=vegetables" className="category-card">
              <div className="category-image">🥬</div>
              <h3 className="category-name">Vegetables</h3>
             {categoryStats["vegetables"] || 0}+ products
              <span className="category-arrow">→</span>
            </Link>

            <Link to="/products?category=fruits" className="category-card">
              <div className="category-image">🍎</div>
              <h3 className="category-name">Fruits</h3>
             {categoryStats["fruits"] || 0}+ products
              <span className="category-arrow">→</span>
            </Link>

            <Link to="/products?category=grains" className="category-card">
              <div className="category-image">🌾</div>
              <h3 className="category-name">Grains & Pulses</h3>
              {categoryStats["grains"] || 0}+ products
              <span className="category-arrow">→</span>
            </Link>

            <Link to="/products?category=dairy" className="category-card">
              <div className="category-image">🥛</div>
              <h3 className="category-name">Dairy Products</h3>
             {categoryStats["dairy"] || 0}+ products
              <span className="category-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Enhanced call to action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-wrapper">
            <div className="cta-content">
              <span className="cta-badge">Start Selling Today</span>
              <h2 className="cta-title">
                Ready to Grow Your Farm Business?
              </h2>
              <p className="cta-description">
                Join thousands of farmers already selling on KisanCart. 
                Get access to millions of buyers across India.
              </p>
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary btn-large">
                  Register as Farmer
                  <svg className="btn-icon-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <Link to="/contact" className="btn btn-outline-primary btn-large">
                  Contact Sales Team
                </Link>
              </div>
              <div className="cta-features">
                <span>✓ Free listing</span>
                <span>✓ PAN India delivery</span>
                <span>✓ 24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* FOOTER - Fixed (removed non-existent routes) */}
            <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3 className="footer-logo">KisanCart <span>🌾</span></h3>
              <p className="footer-description">
                Bridging the gap between farmers and consumers through technology, 
                transparency, and trust.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Facebook">📘</a>
                <a href="#" className="social-link" aria-label="Twitter">🐦</a>
                <a href="#" className="social-link" aria-label="Instagram">📷</a>
                <a href="#" className="social-link" aria-label="LinkedIn">🔗</a>
              </div>
            </div>

            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/products">Browse Products</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-links">
              <h4>For Farmers</h4>
              <ul>
                <li><Link to="/register">Start Selling</Link></li>
                <li><Link to="/dashboard">Farmer Dashboard</Link></li>
              </ul>
            </div>

            <div className="footer-contact">
              <h4>Get in Touch</h4>
              <ul className="contact-list">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  support@kisancart.com
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  +91 1800 123 4567
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  New Delhi, India
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} KisanCart. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/refund">Refund Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}