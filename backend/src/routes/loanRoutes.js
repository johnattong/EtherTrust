const express = require("express");
const router = express.Router();

// Placeholder route
router.get("/", (req, res) => {
    res.send("Loan routes are working!");
});

module.exports = router;
