// authRoutes.js

const express = require('express');
const passport = require('../passport');
const { retrieveOrCreateUser } = require('../controllers/user');
const jwt = require('jsonwebtoken');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

const router = express.Router();

async function processLogin(req, res) {
  try {
    const profile = req.session.passport ? req.session.passport.user : req.session.user;
    const user = await retrieveOrCreateUser(profile);

    user.lastLoginFormatted = user.lastLogin.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    user.lastLogin = new Date();
    user.loginCount = user.loginCount + 1;

    await user.save();

    // Override the session user with the local user object
    req.session.passport.user = user;
    req.user = user; // Set the user object in req.user

    // Sign the token with the local user object
    const token = jwt.sign(user.toObject(), process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });

  } catch (error) {
    console.log(error);
  }
}

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/django',
  passport.authenticate('django')
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  async (req, res) => {
    await processLogin(req, res);
    res.redirect(process.env.APP_HOST + '/');
  }
);

router.get('/django/callback',
  passport.authenticate('django', { failureRedirect: '/error' }),
  async (req, res) => {
    await processLogin(req, res);
    res.redirect(process.env.APP_HOST + '/');
  }
);

router.post('/local',
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  async (req, res) => {
    await processLogin(req, res);
    res.redirect(process.env.APP_HOST + '/');
  }
);

router.get('/check', ensureAuthenticated, (req, res) => {
  res.json(req.user);
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  req.logout(err => {
    if (err) return next(err);
    res.status(200).send();
  });
});

module.exports = router;