const path = require('path');
const fs = require('fs');
const logger = require('morgan');

// Load environment variables securely
require("dotenv").config({ path: "./config.env" });

// MongoDB setup
const mongoose = require('mongoose');

// Read MongoDB URI and database name from environment variables
const mongoURI = process.env.MONGO_URI;
const mongoDB = process.env.MONGO_DB;

// Connect to MongoDB
mongoose.connect(mongoURI, { dbName: mongoDB });

const db = mongoose.connection;

// Check MongoDB connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB database");
});

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const passport = require('./passport'); // Require the passport module
const authRoutes = require('./routes/auth'); // Require the authentication routes module
const assessmentRoutes = require('./routes/assessments'); // Require the assessments routes module

const app = express();
const port = process.env.PORT || 3080;

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Use cookie-parser middleware
app.use(cookieParser());
app.use(logger('dev'));

// Session configuration
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Middleware to parse JSON bodies
app.use(express.json());

// Use authentication routes
app.use('/auth', authRoutes);

// Use assessments routes
app.use('/api/assessments', assessmentRoutes);

// Start server
app.listen(port, () => console.log('App listening on port ' + port));