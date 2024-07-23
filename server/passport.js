// passport.js

const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const OAuth2Strategy = require('passport-oauth2').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { retrieveUserByEmail } = require('./controllers/user');

// Passport setup for Google authentication
passport.use('google', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  profile.email = profile.emails[0].value;
  profile.name = profile.displayName;
  profile.authMethod = 'google';
  return done(null, profile);
}));

// Passport setup for Django authentication
passport.use('django', new OAuth2Strategy({
  authorizationURL: 'https://theodi.org/auth/authorize/',
  tokenURL: 'https://theodi.org/auth/token/',
  clientID: process.env.DJANGO_CLIENT_ID,
  clientSecret: process.env.DJANGO_CLIENT_SECRET,
  callbackURL: process.env.DJANGO_CALLBACK_URL,
  grant_type: 'authorization_code', // Specify grant type
  pkce: true, // Enable PKCE,
  state: true,
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  fetch('https://theodi.org/api/user', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return response.json();
  })
  .then(userProfile => {
    // Merge the fetched user profile with the profile object
    Object.keys(userProfile).forEach(key => {
      profile[key] = userProfile[key];
    });
    profile.name = userProfile.first_name + ' ' + userProfile.last_name;
    return done(null, profile);
  })
  .catch(error => {
    console.error('Error fetching user profile:', error);
    return done(error);
  });
}));

// Passport setup for Local authentication
passport.use('local', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await retrieveUserByEmail(email);
      if (!user) {
        return done({ status: 401, message: 'Incorrect email.' }, false);
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return done({ status: 401, message: 'Incorrect password.' }, false);
      }
      const plainUser = user.toObject();
      plainUser.id = user._id.toString();

      return done(null, plainUser);
    } catch (error) {
      console.log(error);
      return done({ status: 500, message: 'Internal Server Error' }, false);
    }
  }
));

// Serialize and deserialize user
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

module.exports = passport;