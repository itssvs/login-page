import React, { useState } from 'react';
import './Login.css';
import user_icon from '../assests/person.png';
import email_icon from '../assests/email.png';
import password_icon from '../assests/password.png';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [action, setAction] = useState("Sign Up"); // Sign Up or Login
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const handleLogin = () => {
  fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if(data.message === "Login successful"){
          localStorage.setItem('token', data.token); // Save token
          navigate("/dashboard");
      }
      else{
          alert(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Cannot connect to server. Make sure backend is running!');
    });
};


  const handleSignup = () => {
  fetch("http://localhost:5000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
    .then(res => res.json())
    .then(data => {
      if(data.message === "Signup successful"){
          localStorage.setItem('token', data.token); // Save token
          navigate("/dashboard");
      }
      else{
          alert(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Cannot connect to server. Make sure backend is running!');
    });
};

  return (
    <div className='container'>

      {/* Header */}
      <div className="header">
        <div className='text'>{action}</div>
        <div className='underline'></div>
      </div>

      {/* Inputs */}
      <div className="inputs">

        {/* Name field for Sign Up */}
        {action === "Sign Up" && (
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        {/* Email */}
        <div className="input">
          <img src={email_icon} alt="" />
          <input
            type="email"
            placeholder="Email Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="input">
          <img src={password_icon} alt="" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

      </div>

      {/* Forgot password for Login */}
      {action === "Login" && (
        <div className="forgot-password">
          Forgot Password? <span>Click Here!</span>
        </div>
      )}

      {/* Submit button */}
      <div className="submit-container">
        {action === "Sign Up" ? (
          <div className="submit" onClick={handleSignup}>Sign Up</div>
        ) : (
          <div className="submit" onClick={handleLogin}>Login</div>
        )}
      </div>

      {/* Tabs at bottom */}
      <div className="tab-container">
        <div
          className={`tab ${action === "Sign Up" ? "active" : ""}`}
          onClick={() => setAction("Sign Up")}
        >
          Sign Up
        </div>
        <div
          className={`tab ${action === "Login" ? "active" : ""}`}
          onClick={() => setAction("Login")}
        >
          Login
        </div>
      </div>

    </div>
  );
};

export default Login;
