const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },	// We'll need to change how we store this
  walletAddress: String,			// and this too
});

module.exports = mongoose.model("User", UserSchema);
