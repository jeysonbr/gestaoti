const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const router = express.Router();

// Rota de Registro
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir o usuário no banco de dados
    const newUser = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota de Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verificar se o usuário existe
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    // Verificar a senha
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    // Gerar um token JWT
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;


const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Acesso negado' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Token inválido' });
  }
};

module.exports = { router, verifyToken };

