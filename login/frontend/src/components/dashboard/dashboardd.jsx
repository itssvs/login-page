import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import { authFetch, isAuthenticated, removeToken } from "../../utils/auth";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
      return;
    }

    loadUser();
  }, [navigate]);

  const loadUser = async () => {
    try {
      const data = await authFetch("/dashboard");
      setUser(data.user);
    } catch {
      handleLogout();
    }
  };

  const handleLogout = () => {
    removeToken();
    alert("You have been logged out successfully!");
    navigate("/");
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
