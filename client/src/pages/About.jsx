// About.jsx - Improved Spacing & Layout
import React, { useEffect, useState } from "react";
import { FaLeaf, FaUsers, FaHandshake, FaTruck, FaChartLine, FaUserCheck, FaSeedling, FaShoppingBasket } from 'react-icons/fa';
import { GiFarmer, GiFruitBowl, GiPlantWatering } from 'react-icons/gi';
import "../styles/About.css";
import myPhoto from "../assets/fazul.png";
import API from "../api/axios";

export default function About() {
  const [stats, setStats] = useState({
    farmers: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await API.get("/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  }

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <FaLeaf className="me-2" />
              Our Story
            </div>
            <h1 className="hero-title">
              Revolutionizing <span className="hero-highlight">Agriculture</span> Commerce
            </h1>
            <p className="hero-description">
              KisanCart is India's premier digital marketplace creating direct connections between 
              farmers and consumers, eliminating middlemen and ensuring fair prices for all.
            </p>
            <div className="hero-buttons">
              <a href="#mission" className="btn-primary">
                <GiFarmer className="me-2" />
                Our Mission
              </a>
              <a href="/register" className="btn-secondary">
                Join Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <h2 className="stat-number">{stats.farmers.toLocaleString()}+</h2>
              <p className="stat-label">Farmers Registered</p>
            </div>
            <div className="stat-card">
              <h2 className="stat-number">{stats.products.toLocaleString()}+</h2>
              <p className="stat-label">Products Listed</p>
            </div>
            <div className="stat-card">
              <h2 className="stat-number">{stats.orders.toLocaleString()}+</h2>
              <p className="stat-label">Orders Placed</p>
            </div>
            <div className="stat-card">
              <h2 className="stat-number">₹{stats.revenue.toLocaleString()}+</h2>
              <p className="stat-label">Farmer Revenue</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content">
              <span className="section-badge">OUR PURPOSE</span>
              <h2 className="section-title">
                Empowering Farmers, <span className="text-success">Transforming</span> Agriculture
              </h2>
              <p className="section-description">
                KisanCart was developed as a full-stack learning project focused on solving real-world agricultural trade challenges.
              </p>
              <div className="mission-feature">
                <div className="feature-icon">
                  <FaHandshake />
                </div>
                <div className="feature-content">
                  <h5>Fair Trade Revolution</h5>
                  <p>
                    We're building a transparent ecosystem where farmers get 40-60% higher prices 
                    while consumers save 20-30% on fresh produce.
                  </p>
                </div>
              </div>
            </div>
            <div className="mission-image">
              <div className="image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Farmers Market" 
                  className="mission-img"
                />
              </div>
              <div className="image-card">
                <div className="image-card-icon">
                  <GiFruitBowl />
                </div>
                <div className="image-card-content">
                  <h5>100% Fresh</h5>
                  <small>Farm to table in 24-48 hours</small>
                  <p>Direct sourcing ensures maximum freshness and nutritional value</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="howitworks-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">PROCESS</span>
            <h2 className="section-title">How KisanCart Works</h2>
            <p className="section-subtitle">
              A seamless four-step process that bridges the gap between farmers and consumers
            </p>
          </div>

          <div className="steps-grid">
            {[
              { icon: <GiFarmer />, title: "Farmers List", desc: "Farmers upload their produce with quality photos and details", step: 1 },
              { icon: <FaShoppingBasket />, title: "Buyers Browse", desc: "Customers explore verified farms and fresh produce", step: 2 },
              { icon: <FaHandshake />, title: "Direct Order", desc: "Place orders with transparent pricing and farmer chat", step: 3 },
              { icon: <FaTruck />, title: "Fast Delivery", desc: "Doorstep delivery or local pickup within 48 hours", step: 4 }
            ].map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.step}</div>
                <div className="step-icon">{step.icon}</div>
                <h5 className="step-title">Step {step.step}: {step.title}</h5>
                <p className="step-description">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="values-section">
        <div className="container">
          <div className="values-grid">
            {/* For Farmers */}
            <div className="value-card">
              <span className="value-badge">FOR FARMERS</span>
              <h3 className="value-title">Empowering Agricultural Entrepreneurs</h3>
              <ul className="value-list">
                {[
                  "Real-time market prices and demand insights",
                  "Digital storefront for your farm",
                  "Secure and timely payments",
                  "Quality certification and verification",
                  "Market access beyond geographical boundaries",
                  "Reduced post-harvest losses"
                ].map((item, index) => (
                  <li key={index}>
                    <FaChartLine className="value-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Buyers */}
            <div className="value-card">
              <span className="value-badge">FOR BUYERS</span>
              <h3 className="value-title">Freshness You Can Trust</h3>
              <ul className="value-list">
                {[
                  "Farm-fresh produce within 48 hours",
                  "Traceability from farm to table",
                  "Competitive pricing without middlemen",
                  "Seasonal and organic selections",
                  "Direct farmer communication",
                  "Sustainable and eco-friendly packaging"
                ].map((item, index) => (
                  <li key={index}>
                    <FaUserCheck className="value-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">ABOUT THE DEVELOPER</span>
            <h2 className="section-title">Project Creator</h2>
            <p className="section-subtitle">
              The passionate mind behind KisanCart's mission to revolutionize Indian agriculture
            </p>
          </div>

          <div className="team-card">
            <div className="team-image">
              <div className="team-avatar">
                <img src={myPhoto} alt="Shaik Fazul Ahammad" />
              </div>
            </div>
            <div className="team-content">
              <h3 className="team-name">Shaik Fazul Ahammad</h3>
              <p className="team-role">Founder & MERN Stack Developer</p>
              <p className="team-bio">
                Shaik Fazul Ahammad is a Computer Science undergraduate and MERN Stack developer
                who built KisanCart as a full-stack project to understand and solve real-world
                challenges in agricultural trade. The platform focuses on direct farmer–buyer
                interaction, transparent pricing, and practical use of modern web technologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Agriculture Together?</h2>
            <p className="cta-description">
              Join over 50,000 users who are already benefiting from direct farm-to-consumer connections
            </p>
            <div className="cta-buttons">
              <a href="/register" className="cta-btn-primary">
                <GiFarmer className="me-2" />
                Register as Farmer
              </a>
              <a href="/register" className="cta-btn-secondary">
                <FaShoppingBasket className="me-2" />
                Join as Buyer
              </a>
            </div>
            <p className="cta-footer">
              Already have an account? <a href="/login" className="cta-link">Sign in</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}