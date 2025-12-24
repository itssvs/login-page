require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

// Use routes
app.use('/', authRoutes);
app.use('/', dashboardRoutes);

// START SERVER 
app.listen(PORT, () => {  console.log(`🚀 Server running on http://localhost:${PORT}`);
});