const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db'); // Certifique-se de que esse arquivo está configurado para se conectar ao PostgreSQL
const authRoutes = require('./auth');
const app = express();


const app = express();
app.use(express.json()); // Permite o servidor Express lidar com JSON no corpo das requisições
app.use('/auth', authRoutes); // Use as rotas de autenticação

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


// Rota de Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verifica se o usuário existe no banco de dados
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    // Verifica se a senha está correta
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    // Gera um token JWT
    const token = jwt.sign({ id: user.rows[0].id }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

const { verifyToken } = require('./auth');

// Rota protegida
app.get('/dashboard', verifyToken, (req, res) => {
  res.send('Bem-vindo ao dashboard!');
});



