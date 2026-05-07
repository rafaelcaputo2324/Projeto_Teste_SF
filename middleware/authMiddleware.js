const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  try {
    jwt.verify(token, 'segredo');
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

module.exports = authMiddleware;