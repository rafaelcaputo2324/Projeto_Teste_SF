const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.run(
    'INSERT INTO users(name, email, password) VALUES(?,?,?)',
    [name, email, hash],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      res.json({ message: 'Usuário cadastrado com sucesso' });
    }
  );
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, user) => {
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ message: 'Senha inválida' });
      }

      const token = jwt.sign({ id: user.id }, 'segredo');

      res.json({ token });
    }
  );
});

module.exports = router;