// authRoutes.js

const express = require('express');
const passport = require('../passport'); // Require the passport module
const jwt = require('jsonwebtoken');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

const router = express.Router();

// Authentication route for Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Authentication route for Django
router.get('/django',
  passport.authenticate('django')
);

// Callback endpoint for Google authentication
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  async (req, res) => {
    const user = req.user;
    req.session.authMethod = 'google';
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('//localhost:3000/');
  }
);

// Callback endpoint for Django authentication
router.get('/django/callback',
  passport.authenticate('django', { failureRedirect: '/error' }),
  async (req, res) => {
    const user = req.user;
    console.log(user);
    req.session.authMethod = 'django';
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(token);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('//localhost:3000/');
  }
);

// Route to check if user is logged in
router.get('/check', ensureAuthenticated, (req, res) => {
  res.json(req.user);
});


// Logout route
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  req.logout(err => {
    if (err) return next(err);
    res.status(200).send();
  });
});

module.exports = router;