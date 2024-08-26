// src/controllers/userController.js
const pool = require('../db');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerUser };
