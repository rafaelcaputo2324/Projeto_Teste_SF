const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  db.all('SELECT id, name, email FROM users', [], (err, rows) => {
    res.json(rows);
  });
});

module.exports = router;