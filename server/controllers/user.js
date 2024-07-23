const path = require('path');
const cron = require('node-cron');
const User = require('../models/User'); // Import the Token model
const Assessment = require('../models/Assessment');
const bcrypt = require('bcrypt');

// Load environment variables securely
require("dotenv").config({ path: "../config.env" });

let currentDefaultPassword = process.env.DEFAULT_PASSWORD || "defaultPassword123";

// Local accounts
async function retrieveUserByEmail(email) {
  let user = await User.findOne({ email });
  if (!user) {
    // Create a new user with a default password
    const hashedPassword = await bcrypt.hash(currentDefaultPassword, 10); // Use a secure default password
    user = new User({
      name: email,
      email: email,
      password: hashedPassword,
      firstLogin: new Date(),
      loginCount: 0,
      lastLogin: new Date()
      // Add other user fields as necessary
    });
    await user.save();
  }
  return user;
}

// Local accounts
async function deleteLocalAssessmentsAndAccounts() {
  try {
    // Find all users that have a password set (local accounts)
    const users = await User.find({ password: { $exists: true, $ne: null } });
    const userIds = users.map(user => user._id);

    // Delete all projects owned by these users
    await Assessment.deleteMany({ owner: { $in: userIds } });

    // Delete the users themselves
    await User.deleteMany({ _id: { $in: userIds } });
  } catch (error) {
    console.log(error);
  }
}

async function updateDefaultPassword(newPassword) {
  currentDefaultPassword = newPassword;
}

async function getDefaultPassword(newPassword) {
  return currentDefaultPassword;
}

function generateRandomPassword(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
}

// Schedule the task to run at 3:30 am UTC every day
cron.schedule('30 3 * * *', async () => {
  console.log('Running the scheduled task to delete local projects and accounts and reset password');
  await updateDefaultPassword(generateRandomPassword(12));
  await deleteLocalProjectsAndAccounts();
}, {
  timezone: "UTC"
});

// Function to retrieve or create a user based on the profile data
async function retrieveOrCreateUser(profile) {
    let user = await User.findOne({ email: profile.email });

    if (!user) {
      user = new User({
        name: profile.name,
        email: profile.email,
        firstLogin: new Date(),
        loginCount: 0,
        lastLogin: new Date()
      });
      await user.save();
    }

    return user;
}

async function deleteUser(userId) {
  try {
      // Find the user by their ID and delete it
      const deletedUser = await User.findByIdAndDelete(userId);
      return deletedUser;
  } catch (error) {
      throw error; // Propagate the error to the caller
  }
}

module.exports = { retrieveUserByEmail, retrieveOrCreateUser, deleteUser, deleteLocalAssessmentsAndAccounts, updateDefaultPassword, getDefaultPassword };