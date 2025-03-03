const app = require("./src/app");
const mongoose = require("mongoose");
require("dotenv").config();

// TODO: need to set up a server for our project
// TODO: store this in a .env file
const PORT = 0;
const MONGO_URI = 0;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
