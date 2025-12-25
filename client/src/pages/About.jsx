import React, { useEffect, useState } from "react";

import { FaLeaf, FaUsers, FaHandshake, FaTruck, FaChartLine, FaUserCheck, FaSeedling, FaShoppingBasket } from 'react-icons/fa';
import { GiFarmer, GiFruitBowl, GiPlantWatering } from 'react-icons/gi';
import "../styles/About.css";
import myPhoto from "../assets/fazul.png";

export default function About() {
const [stats, setStats] = useState({
  farmers: 0,
  products: 0,
  orders: 0,
  revenue:0
});

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
    <>
      {/* Hero Section */}
      <section className="about-hero bg-gradient-primary position-relative overflow-hidden">
        <div className="container position-relative z-2 py-6 py-lg-8">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <div className="mb-4">
                <span className="badge bg-white text-success fw-semibold px-4 py-2 rounded-pill mb-3">
                  <FaLeaf className="me-2" />
                  Our Story
                </span>
              </div>
              <h1 className="display-4 fw-bold text-white mb-4">
                Revolutionizing <span className="text-warning">Agriculture</span> Commerce
              </h1>
              <p className="lead text-white opacity-90 mb-5">
                KisanCart is India's premier digital marketplace creating direct connections between 
                farmers and consumers, eliminating middlemen and ensuring fair prices for all.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <a href="#mission" className="btn btn-light btn-lg px-4 rounded-pill fw-semibold">
                  <GiFarmer className="me-2" />
                  Our Mission
                </a>
                <a href="/register" className="btn btn-outline-light btn-lg px-4 rounded-pill fw-semibold">
                  Join Now
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="position-absolute top-0 end-0 w-50 h-100 bg-white bg-opacity-10 rounded-start-5"></div>
        <div className="position-absolute bottom-0 start-0">
          <GiPlantWatering className="text-white opacity-10" size={300} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-3 col-6 text-center">
              <div className="stat-card p-3">
              <h2 className="display-5 fw-bold text-success mb-2">
            {stats.farmers}
          </h2>
                <p className="text-muted mb-0">Farmers Registered</p>
              </div>
            </div>
            <div className="col-md-3 col-6 text-center">
              <div className="stat-card p-3">
              <h2 className="display-5 fw-bold text-success mb-2">
            {stats.products}
          </h2>
                <p className="text-muted mb-0">products</p>
              </div>
            </div>
            <div className="col-md-3 col-6 text-center">
              <div className="stat-card p-3">
              <h2 className="display-5 fw-bold text-success mb-2">
            {stats.orders}
          </h2>
                <p className="text-muted mb-0">Orders placed</p>
              </div>
            </div>
            <div className="col-md-3 col-6 text-center">
              <div className="stat-card p-3">
              <h2 className="fw-bold text-success">
    ₹{stats.revenue}
  </h2>
                <p className="text-muted mb-0">Farmer Revenue</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="py-6 py-lg-8">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="pe-lg-5">
                <span className="text-success fw-semibold d-inline-block mb-3">OUR PURPOSE</span>
                <h2 className="display-6 fw-bold mb-4">
                  Empowering Farmers, <span className="text-success">Transforming</span> Agriculture
                </h2>
                <p className="text-muted fs-5 mb-4">
                KisanCart was developed as a full-stack learning project
focused on solving real-world agricultural trade challenges.

                </p>
                <div className="d-flex align-items-start mb-3">
                  <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                    <FaHandshake className="text-success fs-4" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2">Fair Trade Revolution</h5>
                    <p className="text-muted mb-0">
                      We're building a transparent ecosystem where farmers get 40-60% higher prices 
                      while consumers save 20-30% on fresh produce.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <div className="rounded-4 overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                    alt="Farmers Market" 
                    className="img-fluid"
                    style={{ height: '400px', width: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="position-absolute bottom-0 start-0 translate-middle-y ms-5">
                  <div className="bg-white rounded-4 shadow p-4" style={{ width: '280px' }}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                        <GiFruitBowl className="text-success fs-3" />
                      </div>
                      <div>
                        <h5 className="fw-bold mb-0">100% Fresh</h5>
                        <small className="text-muted">Farm to table in 24-48 hours</small>
                      </div>
                    </div>
                    <p className="text-muted small mb-0">
                      Direct sourcing ensures maximum freshness and nutritional value
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-6 py-lg-8 bg-light">
        <div className="container">
          <div className="text-center mb-6">
            <span className="text-success fw-semibold d-inline-block mb-3">PROCESS</span>
            <h2 className="display-6 fw-bold mb-4">How KisanCart Works</h2>
            <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '700px' }}>
              A seamless four-step process that bridges the gap between farmers and consumers
            </p>
          </div>

          <div className="row g-4 position-relative">
            {/* Connecting Line */}
            <div className="position-absolute top-50 start-0 end-0 h-1 bg-success bg-opacity-25 d-none d-lg-block"></div>
            
            {[
              { icon: <GiFarmer />, title: "Farmers List", desc: "Farmers upload their produce with quality photos and details", color: "primary" },
              { icon: <FaShoppingBasket />, title: "Buyers Browse", desc: "Customers explore verified farms and fresh produce", color: "warning" },
              { icon: <FaHandshake />, title: "Direct Order", desc: "Place orders with transparent pricing and farmer chat", color: "success" },
              { icon: <FaTruck />, title: "Fast Delivery", desc: "Doorstep delivery or local pickup within 48 hours", color: "info" }
            ].map((step, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="step-card position-relative">
                  <div className={`step-number bg-${step.color} text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4`}
                    style={{ width: '60px', height: '60px' }}>
                    <span className="fs-4">{step.icon}</span>
                  </div>
                  <h5 className="fw-bold mb-3">Step {index + 1}: {step.title}</h5>
                  <p className="text-muted mb-0">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-6 py-lg-8">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <div className="pe-lg-5">
                <span className="text-success fw-semibold d-inline-block mb-3">FOR FARMERS</span>
                <h2 className="display-6 fw-bold mb-4">Empowering Agricultural Entrepreneurs</h2>
                <div className="value-list">
                  {[
                    "Real-time market prices and demand insights",
                    "Digital storefront for your farm",
                    "Secure and timely payments",
                    "Quality certification and verification",
                    "Market access beyond geographical boundaries",
                    "Reduced post-harvest losses"
                  ].map((item, index) => (
                    <div key={index} className="d-flex align-items-center mb-3">
                      <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                        <FaChartLine className="text-success" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="ps-lg-5">
                <span className="text-success fw-semibold d-inline-block mb-3">FOR BUYERS</span>
                <h2 className="display-6 fw-bold mb-4">Freshness You Can Trust</h2>
                <div className="value-list">
                  {[
                    "Farm-fresh produce within 48 hours",
                    "Traceability from farm to table",
                    "Competitive pricing without middlemen",
                    "Seasonal and organic selections",
                    "Direct farmer communication",
                    "Sustainable and eco-friendly packaging"
                  ].map((item, index) => (
                    <div key={index} className="d-flex align-items-center mb-3">
                      <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                        <FaUserCheck className="text-success" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-6 py-lg-8 bg-light">
        <div className="container">
          <div className="text-center mb-6">
            <span className="text-success fw-semibold d-inline-block mb-3"> ABOUT THE DEVELOPER</span>
            <h2 className="display-6 fw-bold mb-4">Project Creator</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              The passionate mind behind KisanCart's mission to revolutionize Indian agriculture
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="row g-0">
                  <div className="col-md-4 bg-success bg-opacity-5 d-flex align-items-center justify-content-center p-4">
                    <div className="text-center">
                      <div className="rounded-circle overflow-hidden border border-4 border-white shadow mb-3 mx-auto"
                        style={{ width: '180px', height: '180px' }}>
                        <img 
                          src={myPhoto}
                          alt="Shaik Fazul Ahammad" 
                          className="img-fluid"
                        />
                      </div>
                      <div className="social-links d-flex justify-content-center gap-3">
                        <a href="#" className="text-success"><i className="bi bi-linkedin"></i></a>
                        <a href="#" className="text-success"><i className="bi bi-twitter"></i></a>
                        <a href="#" className="text-success"><i className="bi bi-github"></i></a>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="card-body p-5">
                      <h3 className="fw-bold mb-1">Shaik Fazul Ahammad</h3>
                      <p className="text-success fw-semibold mb-4">Founder & MERN Stack Developer</p>
                      
                      <p className="text-muted mb-4">
                      Shaik Fazul Ahammad is a Computer Science undergraduate and MERN Stack developer
  who built KisanCart as a full-stack project to understand and solve real-world
  challenges in agricultural trade. The platform focuses on direct farmer–buyer
  interaction, transparent pricing, and practical use of modern web technologies.
                      </p>
                      
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-6 py-lg-8 bg-gradient-success">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h2 className="display-5 fw-bold text-white mb-4">
                Ready to Transform Agriculture Together?
              </h2>
              <p className="text-white opacity-90 fs-5 mb-5">
                Join over 50,000 users who are already benefiting from direct farm-to-consumer connections
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <a href="/register" className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold shadow">
                  <GiFarmer className="me-2" />
                  Register as Farmer
                </a>
                <a href="/register" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold">
                  <FaShoppingBasket className="me-2" />
                  Join as Buyer
                </a>
              </div>
              <p className="text-white opacity-75 mt-4 small">
                Already have an account? <a href="/login" className="text-white fw-semibold">Sign in</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      
    </>
  );
}