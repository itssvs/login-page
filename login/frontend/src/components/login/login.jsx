import React, { useState } from 'react';
import './Login.css';
import user_icon from '../assests/person.png';
import email_icon from '../assests/email.png';
import password_icon from '../assests/password.png';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [ formState, setFormState]= useState({
    action: "Sign Up",
    name:"",
    email:"",
    password:""
  });

  const handleChange = (field, value) =>{
    setFormState(prev =>({
      ...prev,
      [field]:value
    }));
  };
  
  const handleLogin = () => {
  fetch(`${process.env.REACT_APP_API_URL}/login`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      email: formState.email,
      password: formState.password
     })
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
  fetch(`${process.env.REACT_APP_API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: formState.name,
      email: formState.email,
      password: formState.password
     })
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
        <div className='text'>{formState.action}</div>
        <div className='underline'></div>
      </div>

      {/* Inputs */}
      <div className="inputs">

        {/* Name field for Sign Up */}
        {formState.action === "Sign Up" && (
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="text"
              placeholder="Name"
              value={formState.name}
              onChange={(e) => handleChange("name",e.target.value)}
            />
          </div>
        )}

        {/* Email */}
        <div className="input">
          <img src={email_icon} alt="" />
          <input
            type="email"
            placeholder="Email Id"
            value={formState.email}
            onChange={(e) => handleChange("email",e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="input">
          <img src={password_icon} alt="" />
          <input
            type="password"
            placeholder="Password"
            value={FormState.password}
            onChange={(e) => handleChange("password",e.target.value)}
          />
        </div>

      </div>

      {/* Forgot password for Login */}
      {formState.action === "Login" && (
        <div className="forgot-password">
          Forgot Password? <span>Click Here!</span>
        </div>
      )}

      {/* Submit button */}
      <div className="submit-container">
        {formState.action === "Sign Up" ? (
          <div className="submit" onClick={handleSignup}>Sign Up</div>
        ) : (
          <div className="submit" onClick={handleLogin}>Login</div>
        )}
      </div>

      {/* Tabs at bottom */}
      <div className="tab-container">
        <div
          className={`tab ${formState.action === "Sign Up" ? "active" : ""}`}
          onClick={() => handleChange("action","Sign Up")}
        >
          Sign Up
        </div>
        <div
          className={`tab ${formState.action === "Login" ? "active" : ""}`}
          onClick={() => handleChange("action","Login")}
        >
          Login
        </div>
      </div>

    </div>
  );
};

export default Login;
