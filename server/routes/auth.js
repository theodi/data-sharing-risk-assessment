// authRoutes.js

const express = require('express');
const passport = require('../passport'); // Require the passport module
const { deleteLocalAssessmentsAndAccounts, retrieveOrCreateUser, updateDefaultPassword, getDefaultPassword } = require('../controllers/user');
const jwt = require('jsonwebtoken');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

const router = express.Router();

async function processLogin(req, res) {
  try {
    const profile = req.session.passport ? req.session.passport.user : req.session.user;
    const user = await retrieveOrCreateUser(profile);

    // Update last login data
    user.lastLoginFormatted = user.lastLogin.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    user.lastLogin = new Date();
    user.loginCount = user.loginCount + 1;

    // Save the user
    await user.save();

    req.session.passport.user.id = user._id;
    /*
    if (req.session.authMethod !== 'local') {
      await getHubspotUser(user._id,user.email);
    }
    */

  } catch (error) {
    console.log(error);
  }
}

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
    await processLogin(req);
    res.redirect(process.env.APP_HOST + '/');
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
    res.cookie('token', token, { httpOnly: true });
    await processLogin(req);
    res.redirect(process.env.APP_HOST + '/');
  }
);

// Authentication route for local accounts
router.post('/local',
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  async (req, res) => {
    req.session.authMethod = 'local';
    await processLogin(req);
    res.redirect(process.env.APP_HOST + '/');
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


// Middleware to ensure user is authenticated
async function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.session.authMethod === 'google') {
    return next();
  }
  const error = new Error('Unauthorized');
  error.status = 401;
  return next(error);
}

// Route to render reset password page for local users
router.get('/local/reset-password', isAdmin,  (req, res) => {
  res.render('pages/changeLocalPassword', {
    page: {
      title: 'Reset Local Account Password',
      link: '/reset-password'
    }
  });
});

// Get local password
router.get('/local/password', isAdmin, async (req, res) => {
  let currentPassword = await getDefaultPassword();
  res.json({ currentPassword: currentPassword });
});

// Route to handle password reset
router.post('/local/password', isAdmin, async (req, res, next) => {
  const { newPassword } = req.body;
  try {
    // Delete all local projects and accounts before updating the password
    await deleteLocalAssessmentsAndAccounts();

    // Update local accounts password
    await updateDefaultPassword(newPassword);

    res.status(200).json({ message: 'Password reset successfully and previous local users and projects deleted.' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;