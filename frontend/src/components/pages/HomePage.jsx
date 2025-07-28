import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Welcome to Project Portal</h1>
      <div className="homepage-buttons">
        <button onClick={() => navigate('/login')} className="homepage-btn">Login</button>
        <button onClick={() => navigate('/signup')} className="homepage-btn">Signup</button>
      </div>
    </div>
  );
}

export default HomePage;

