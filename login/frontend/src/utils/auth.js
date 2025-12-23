// src/utils/auth.js

const TOKEN_KEY = 'auth_token';
const API_URL = process.env.REACT_APP_API_URL;

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const errorMessage = data.message || response.statusText || 'Request failed';
    throw new Error(errorMessage);
  }
  
  return data;
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
};

export const signup = async (name, email, password) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  return handleResponse(response);
};

export const authFetch = async (path, options = {}) => {
  const token = getToken();
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  return handleResponse(response);
};

export const verifyToken = async () => {
  try {
    const data = await authFetch('/verify', { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};