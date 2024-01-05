const jwt = require('jsonwebtoken');
const { verifyOptions } = require('../../config/jwt-config');
const fs = require('fs');

const publicKey = fs.readFileSync('public.key', 'utf8');

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Missing token' });
  }

  try {
    const decoded = jwt.verify(token, publicKey, verifyOptions);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateUser;
