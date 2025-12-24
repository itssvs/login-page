import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      updateUser();
    }
  }, [user, updateUser]);

  const handleLogout = () => {
    logout();
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