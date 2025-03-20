const express = require("express");
const router = express.Router();
const addUser = require("../models/User");
const db = require('../../server');
const bcrypt = require('bcryptjs');

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, walletAddress } = req.body;
    const user = await addUser(name, email, password, walletAddress);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
