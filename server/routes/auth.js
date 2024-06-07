// authRoutes.js

const express = require('express');
const passport = require('../passport'); // Require the passport module

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
    req.session.authMethod = 'google';
    res.redirect('//localhost:3000/');
  }
);

// Callback endpoint for Django authentication
router.get('/django/callback',
  passport.authenticate('django', { failureRedirect: '/error' }),
  async (req, res) => {
    req.session.authMethod = 'django';
    res.redirect('//localhost:3000/');
  }
);

// Route to check if user is logged in
router.get('/check', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout(err => {
      if (err) { return next(err); }
      res.status(200).send();
    });
});

module.exports = router;