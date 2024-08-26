// src/app.js
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');

// Use routes
app.use('/api/users', userRoutes);

module.exports = app;
