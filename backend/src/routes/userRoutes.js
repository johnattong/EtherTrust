const express = require("express");
const router = express.Router();
const addUser = require("../models/User");
const db = require('../../server');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const validator = require("validator");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, walletAddress } = req.body;

    // Email validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // Password validation (at least 8 chars, 1 letter, 1 number, 1 special char (@$!%*?&) )
    const password_syntax = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password_syntax.test(password)) {
      return res.status(400).json({ error: "Password must be at least 8 characters long and contain at least one letter, one number, one special char." });
    }

    // Wallet address (42 chars and start with 0x)
    const walletRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!walletRegex.test(walletAddress)) {
      return res.status(400).json({ error: "Invalid Ethereum wallet address." });
    }

    const user = await addUser(name, email, password, walletAddress);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    await db.connectDB();
    const userCollection = db.getDatabase().collection("users");

    // Get user that's trying to login
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Provided info is good, generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, walletAddress: user.walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }   // Token expires in 1 hour, change this?
    );

    // Everything OK, user session should be started now
    res.status(200).json({
      token,
      message: "Login successful.",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout successful. Please remove token on frontend." });
});

router.delete("/delete-account", async (req, res) => {
  try {
    await db.connectDB();
    const userCollection = db.getDatabase().collection("users");

    // First we must check if user even exists
    if (!userCollection) {
      return res.status(404).json({ error: "User not found or already deleted." });
    }

    // Now drop
    const result = await userCollection.deleteOne({ email: req.user.email });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found or already deleted." });
    }
    res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete account." });
  }
});

// Change password
router.post("/change-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Password validation (at least 8 chars, 1 letter, 1 number, 1 special char (@$!%*?&) )
  const password_syntax = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password_syntax.test(newPassword)) {
    return res.status(400).json({ error: "Password must be at least 8 characters long and contain at least one letter, one number, one special char." });
  }

  // Change pass on db
  try {
    // Get user
    await db.connectDB();
    const userCollection = db.getDatabase().collection("users");
    const user = await userCollection.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // NOTE: we might not even need to check pass on the backend
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    // Update password on db
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await userCollection.updateOne(
      { email: req.user.email },
      { $set: { password: hashedNewPassword } }
    );
    res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to change password." });
  }
});


// For backend testing only, pls don't use this anywhere a user could see it
router.post("/test-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    await db.connectDB(); 
    const userCollection = db.getDatabase().collection('users');
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Given email doesn't exist." });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Password not matching." });
    }

    res.status(200).json({ message: "Email and password matched, backend OK." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
