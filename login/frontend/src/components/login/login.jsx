import React, { useState } from 'react';
import './Login.css';
import user_icon from '../assests/person.png';
import email_icon from '../assests/email.png';
import password_icon from '../assests/password.png';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  
  const [formState, setFormState] = useState({
    action: "Sign Up",
    name: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (field, value) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));

    // Fixed: errors (not error)
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) {
      return "Name is required";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: ""
    };

    // Validate name only for signup
    if (formState.action === "Sign Up") {
      newErrors.name = validateName(formState.name);
    }

    newErrors.email = validateEmail(formState.email);
    newErrors.password = validatePassword(formState.password);

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some(error => error !== "");
  };
  
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    const result = await login(formState.email, formState.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      alert(result.message);
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }
    const result = await signup(formState.name, formState.email, formState.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      alert(result.message);
    }
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
          <div className="input-wrapper">
            <div className="input">
              <img src={user_icon} alt="" />
              <input
                type="text"
                placeholder="Name"
                value={formState.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "error-input" : ""}
                required
              />
            </div>
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>
        )}

        {/* Email */}
        <div className="input-wrapper">
          <div className="input">
            <img src={email_icon} alt="" />
            <input
              type="email"
              placeholder="Email Id"
              value={formState.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={errors.email ? "error-input" : ""}
              required
            />
          </div>
          {errors.email && <div className="error-text">{errors.email}</div>}
        </div>

        {/* Password */}
        <div className="input-wrapper">
          <div className="input">
            <img src={password_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              value={formState.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={errors.password ? "error-input" : ""}
              required
            />
          </div>
          {errors.password && <div className="error-text">{errors.password}</div>}
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
          onClick={() => {
            handleChange("action", "Sign Up");
            setErrors({ name: "", email: "", password: "" });
          }}
        >
          Sign Up
        </div>
        <div
          className={`tab ${formState.action === "Login" ? "active" : ""}`}
          onClick={() => {
            handleChange("action", "Login");
            setErrors({ name: "", email: "", password: "" });
          }}
        >
          Login
        </div>
      </div>
    </div>
  );
};

export default Login;