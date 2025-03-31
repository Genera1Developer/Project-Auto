import React from 'react';
 import ReactDOM from 'react-dom/client';
 import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
 import Configuration from './Configuration';
 import AboutUs from './About-Us';
 import './style.css';
 import { AuthProvider } from './AuthContext';
 

 const Home = () => {
  return (
  <div className="home-container">
  <h1>Welcome to Project Auto</h1>
  <p>
  Project Auto automates code modifications based on your specifications.
  Configure your project and let Auto do the work!
  </p>
  </div>
  );
 };
 

 const App = () => {
  const [time, setTime] = React.useState(new Date());
 

  React.useEffect(() => {
  const intervalId = setInterval(() => {
  setTime(new Date());
  }, 1000);
 

  return () => clearInterval(intervalId);
  }, []);
 

  return (
  <AuthProvider>
  <BrowserRouter>
  <div className="app-container">
  <div className="sidebar">
  <div className="sidebar-header">
  <h2>Project Auto</h2>
  </div>
  <nav>
  <ul>
  <li>
  <Link to="/" className="nav-link">
  Home
  </Link>
  </li>
  <li>
  <Link
  to="/Configuration"
  className="nav-link"
  >
  Configuration
  </Link>
  </li>
  <li>
  <Link
  to="/About-Us"
  className="nav-link"
  >
  About Us
  </Link>
  </li>
  </ul>
  </nav>
  </div>
  <div className="content">
  <div className="top-bar">
  <span className="time">{time.toLocaleTimeString()}</span>
  </div>
  <Routes>
  <Route path="/" element={<Home />} />
  <Route
  path="/Configuration"
  element={<Configuration />}
  />
  <Route
  path="/About-Us"
  element={<AboutUs />}
  />
  </Routes>
  </div>
  </div>
  </BrowserRouter>
  </AuthProvider>
  );
 };
 

 const root = ReactDOM.createRoot(document.getElementById('root'));
 root.render(<App />);