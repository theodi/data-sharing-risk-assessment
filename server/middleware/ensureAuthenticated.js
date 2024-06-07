function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated())
      return next();
    else
      res.status(401).json({ message: 'Not authenticated' });
}

module.exports = ensureAuthenticated;