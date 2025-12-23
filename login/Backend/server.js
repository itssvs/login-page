require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./config/db');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

// ==================== SIGNUP ROUTE ====================
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Invalid email format' 
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        message: 'User already exists with this email' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email.toLowerCase(), hashedPassword]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.insertId, email: email.toLowerCase() },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'Signup successful',
      token,
      user: {
        id: result.insertId,
        name: name,
        email: email.toLowerCase()
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Server error during signup' 
    });
  }
});

// ==================== LOGIN ROUTE ====================
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user by email
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login' 
    });
  }
});

// ==================== MIDDLEWARE TO VERIFY TOKEN ====================
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// ==================== PROTECTED ROUTE EXAMPLE ====================
app.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [req.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Welcome to dashboard',
      user: users[0]
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});