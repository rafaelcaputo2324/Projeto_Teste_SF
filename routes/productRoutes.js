const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    res.json(rows);
  });
});

router.post('/', authMiddleware, (req, res) => {
  const { name, price } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({
      error: 'Nome do produto é obrigatório'
    });
  }

  db.run(
    'INSERT INTO products(name, price) VALUES(?, ?)',
    [name, price],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      res.json({ message: 'Produto cadastrado' });
    }
  );
});

router.put('/:id', authMiddleware, (req, res) => {
  const { name, price } = req.body;

  db.run(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [name, price, req.params.id],
    function (err) {
      res.json({ message: 'Produto atualizado' });
    }
  );
});

router.delete('/:id', authMiddleware, (req, res) => {
  db.run(
    'DELETE FROM products WHERE id = ?',
    [req.params.id],
    function () {
      res.json({ message: 'Produto removido' });
    }
  );
});

module.exports = router;
