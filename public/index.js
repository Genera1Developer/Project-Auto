import React from 'react';
 import ReactDOM from 'react-dom/client';
 import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
 import Configuration from './Configuration';
 import AboutUs from './About-Us';
 import { AuthProvider } from './AuthContext';
 import './style.css';
 import { useState, useEffect } from 'react';

 const Home = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
  const intervalId = setInterval(() => {
  setTime(new Date());
  }, 1000);

  return () => clearInterval(intervalId);
  }, []);

  return (
  <div className="home-container">
  <div className="top-bar">
  <span className="time">{time.toLocaleTimeString()}</span>
  </div>
  <h1>Welcome to Project Auto</h1>
  <p>Automate your GitHub repository tasks with ease.</p>
  </div>
  );
 };

 const App = () => {
  return (
  <AuthProvider>
  <Router>
  <div className="app-container">
  <Sidebar />
  <div className="content">
  <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/configuration" element={<Configuration />} />
  <Route path="/about-us" element={<AboutUs />} />
  </Routes>
  </div>
  </div>
  </Router>
  </AuthProvider>
  );
 };

 const Sidebar = () => {
  return (
  <div className="sidebar">
  <Link to="/" className="sidebar-link">Home</Link>
  <Link to="/configuration" className="sidebar-link">Configuration</Link>
  <Link to="/about-us" className="sidebar-link">About Us</Link>
  </div>
  );
 };

 const root = ReactDOM.createRoot(document.getElementById('root'));
 root.render(<App />);