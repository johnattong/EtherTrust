const express = require("express");
const router = express.Router();
const auth = require("../controllers/authMiddleware");
const contract = require("../contracts/contract");
const addLoans = require("../models/Loan");


// Loan routes will follow this address: /api/user/loans/...
// TODO: get loan from an email

// Getters: stuff that will be passed to frontend
// For lenders
router.get("/loans/all", async (req, res) => {
  try {
    await db.connectDB();
    const loans = await db.getDatabase().collection("loans").find({ status: "pending" }).toArray();
    res.status(200).json(loans);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch loans" });
  }
});

// For borrowers
router.get("/loans/mine", auth, async (req, res) => {
  try {
    await db.connectDB();
    const dbRef = db.getDatabase().collection("loans");
    const userLoans = await dbRef.find({$or: [{ borrower: req.user.email }, { lender: req.user.email }]}).toArray();  // lmao
    res.status(200).json(userLoans);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve user's loans" });
  }
});


// Create loan route
router.post("/loans/create", auth, async (req, res) => {
    const { amount, interestRate, duration } = req.body;
  
    // Validate given params are logical
    if (
      typeof amount !== "number" || amount <= 0 || amount > 1000000 ||
      typeof interestRate !== "number" || interestRate < 0 || interestRate > 100 ||
      typeof duration !== "number" || duration <= 0 || duration > 120
    ) {
      return res.status(400).json({ error: "Invalid loan parameters. Please check amount, interest rate, and duration." });
    }

    // See: database schema
    const loan = {
      borrower: req.user.email,
      lender: null,
      amount,
      interestRate,
      duration,
      status: "pending",
      createdAt: new Date(),
    };

    try {
      // Add loan to db
      const dbResult = await addLoans(
        loan.borrower,
        loan.lender,
        loan.amount,
        loan.interestRate,
        loan.duration,
        loan.status,
        loan.createdAt
      );
      if (!dbResult?.insertedId) {
        return res.status(500).json({ error: "Loan failed to insert in DB" });
      }
  
      // Smart contract call
      const tx = await contract.update(amount);
      await tx.wait();
  
      res.status(201).json({
        message: "Loan created and recorded on blockchain.",
        loanId: dbResult.insertedId
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to create loan." });
    }
});

// Fund loan route
router.post("/loans/fund/:loanId", auth, async (req, res) => {
  const { loanId } = req.params;

  try {
    await db.connectDB();
    const dbRef = db.getDatabase().collection("loans");

    const result = await dbRef.updateOne(
      { _id: new ObjectId(loanId), status: "pending" },
      { $set: { lender: req.user.email, status: "funded" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: "Loan already funded or not found" });
    }

    const tx = await contract.update(loan.amount);
    await tx.wait();
    
    res.status(200).json({ message: "Loan funded successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fund loan" });
  }
});
  

module.exports = router;
