// middleware/ensureAuthenticated.js
const jwt = require('jsonwebtoken');

function ensureAuthenticated(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded; // Attach the entire user object to req.user
    next();
  });
}

module.exports = ensureAuthenticated;