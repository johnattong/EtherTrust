const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");
const loanRoutes = require("./routes/loanRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/loan", loanRoutes);

module.exports = app;
