import React, { useState, useEffect, useContext } from 'react';
 import ReactDOM from 'react-dom/client';
 import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
 import './style.css';

 // AuthContext to manage authentication state
 const AuthContext = React.createContext(null);

 // AuthProvider component
 const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('githubToken'));

  const login = (newToken) => {
  setToken(newToken);
  localStorage.setItem('githubToken', newToken);
  };

  const logout = () => {
  setToken(null);
  localStorage.removeItem('githubToken');
  };

  const value = {
  token,
  login,
  logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
 };

 // useAuth hook
 const useAuth = () => {
  return useContext(AuthContext);
 };

 // Home component
 const Home = () => {
  const [time, setTime] = useState(new Date());
  const [repo, setRepo] = useState('');
  const [instructions, setInstructions] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  const intervalId = setInterval(() => {
  setTime(new Date());
  }, 1000);

  return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!token) {
  alert("Please authenticate with GitHub first.");
  navigate('/configuration'); // Redirect to Configuration to authenticate
  return;
  }

  try {
  const response = await fetch('/api/run-auto', {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`, // Include token
  },
  body: JSON.stringify({ repo, instructions }),
  });

  if (response.ok) {
  alert('Project Auto execution started!');
  } else {
  const errorData = await response.json();
  alert(`Error: ${errorData.message || 'Failed to start Project Auto'}`);
  }
  } catch (error) {
  console.error('Error:', error);
  alert('An error occurred while starting Project Auto.');
  }
  };

  return (
  <div className="home-container">
  <div className="top-bar">
  <span className="time">{time.toLocaleTimeString()}</span>
  </div>
  <h1>Welcome to Project Auto</h1>
  <p>Automate your GitHub repository tasks with ease.</p>

  <form onSubmit={handleSubmit} className="auto-form">
  <label htmlFor="repo">GitHub Repository (username/repo):</label>
  <input
  type="text"
  id="repo"
  value={repo}
  onChange={(e) => setRepo(e.target.value)}
  placeholder="username/repo"
  required
  />

  <label htmlFor="instructions">Customization Instructions:</label>
  <textarea
  id="instructions"
  value={instructions}
  onChange={(e) => setInstructions(e.target.value)}
  placeholder="Enter instructions here..."
  rows="4"
  required
  ></textarea>

  <button type="submit" className="start-button">Start</button>
  </form>
  </div>
  );
 };

 // Configuration component
 const Configuration = () => {
  const { token, login, logout } = useAuth();
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
  // Fetch the authentication URL from the backend
  fetch('/api/auth-url')
  .then(response => response.json())
  .then(data => setAuthUrl(data.authUrl))
  .catch(error => console.error('Error fetching auth URL:', error));
  }, []);

  const handleGitHubLogin = () => {
  window.location.href = authUrl; // Redirect to GitHub auth URL
  };

  return (
  <div className="configuration-container">
  <div className="top-bar">
  <span className="time">{new Date().toLocaleTimeString()}</span>
  </div>
  <h2>Configuration</h2>
  {token ? (
  <div>
  <p>Authenticated with GitHub!</p>
  <button onClick={logout} className="logout-button">Logout</button>
  </div>
  ) : (
  <div>
  <p>Connect to your GitHub account to authorize Project Auto.</p>
  <button onClick={handleGitHubLogin} className="login-button">Authenticate with GitHub</button>
  </div>
  )}
  </div>
  );
 };

 // AboutUs component
 const AboutUs = () => {
  return (
  <div className="about-us-container">
  <div className="top-bar">
  <span className="time">{new Date().toLocaleTimeString()}</span>
  </div>
  <h2>About Us</h2>
  <p>Project Auto is designed to automate tasks within your GitHub repositories, making development workflows smoother and more efficient.</p>
  <p>Our mission is to simplify repository management and provide powerful customization options for developers.</p>
  </div>
  );
 };

 // Sidebar component
 const Sidebar = () => {
  return (
  <div className="sidebar">
  <Link to="/" className="sidebar-link">Home</Link>
  <Link to="/configuration" className="sidebar-link">Configuration</Link>
  <Link to="/about-us" className="sidebar-link">About Us</Link>
  </div>
  );
 };

 // App component
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

 const root = ReactDOM.createRoot(document.getElementById('root'));
 root.render(<App />);