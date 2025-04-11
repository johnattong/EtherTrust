const express = require("express");
const router = express.Router();


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

    // TODO: check if given data is correct (syntax, not trying to loan -1$, etc.)
  
    // Basically all we do is insert the loan into the DB
    // TODO: will call function in Loan.js

    // TODO: must do smart contract stuff
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

    // TODO: must do smart contract stuff
    

    res.status(200).json({ message: "Loan funded successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fund loan" });
  }
});
  

module.exports = router;
