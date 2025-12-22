import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token) {
      // If no token, redirect to login
      navigate('/');
      return;
    }

    // Optional: Fetch user data from backend
    fetchUserData(token);
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token is invalid, logout
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Show confirmation
    alert('You have been logged out successfully!');
    
    // Redirect to login page
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Welcome to the Dashboard!</h1>
        {user && <p className="user-name">Hello, {user.name}! 👋</p>}
        <p className="success-message">You are successfully logged in.</p>
        
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;