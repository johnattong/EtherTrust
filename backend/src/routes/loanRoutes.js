const express = require("express");
const router = express.Router();
const auth = require("../controllers/authMiddleware");
const contract = require("../contracts/deployLoan");
const addLoans = require("../models/Loan");
const db = require("../../server");
const { ObjectId } = require("mongodb");
const { deployLoan } = require("../contracts/deployLoan");


// Loan routes will follow this address: /api/user/loans/...

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

// Get by email
router.get("/loans/by-email/:email", auth, async (req, res) => {
  const { email } = req.params;

  try {
    // Connect to db
    await db.connectDB();
    const dbRef = db.getDatabase().collection("loans");

    // Find needed loan(s) by email
    const loans = await dbRef.find({
      $or: [{ borrower: email }, { lender: email }]
    }).toArray();

    if (!loans.length) {
      return res.status(404).json({ message: "No loans found for this email." });
    }

    res.status(200).json(loans);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch loans by email." });
  }
});

// Get by loan id
router.get("/loans/:loanId", auth, async (req, res) => {
  const { loanId } = req.params;

  try {
    // Connect to db and get loan
    await db.connectDB();
    const dbRef = db.getDatabase().collection("loans");
    const loan = await dbRef.findOne({ _id: new ObjectId(loanId) });

    if (!loan) {
      return res.status(404).json({ error: "Loan not found." });
    }

    res.status(200).json(loan);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch loan." });
  }
});

// Get all loan's info in a neat container, by loan id
router.get("/loans/summary/:loanId", auth, async (req, res) => {
  const { loanId } = req.params;

  try {
    await db.connectDB();
    const dbRef = db.getDatabase().collection("loans");
    const loan = await dbRef.findOne({ _id: new ObjectId(loanId) });

    if (!loan) {
      return res.status(404).json({ error: "Loan not found." });
    }

    const repaid = loan.repaidAmount || 0;
    const remaining = loan.amount - repaid;

    res.status(200).json({
      loanId,
      amount: loan.amount,
      repaid,
      remaining,
      status: loan.status,
      borrower: loan.borrower,
      lender: loan.lender,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch loan summary." });
  }
});


// Setters -- things that have actual functionality. TODO for now, functionality not fully verified.

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
      contractAddress: null,
    };

    try {
      // Add loan to db
      const contractAddress = await deployLoan(
          req.user.walletAddress,
          amount,
          interestRate,
          duration
      );
      loan.contractAddress = contractAddress;

      const dbResult = await addLoans(
        loan.borrower,
        loan.lender,
        loan.amount,
        loan.interestRate,
        loan.duration,
        loan.status,
        loan.createdAt,
          contractAddress
      );
      if (!dbResult?.insertedId) {
        return res.status(500).json({ error: "Loan failed to insert in DB" });
      }

      res.status(201).json({
        message: "Loan created and smart contract deployed.",
        loanId: dbResult.insertedId,
        contractAddress
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to create loan." });
    }
});

// Fund loan route -- allows a lender to approve and fund a borrower's loan request.
router.post("/loans/fund/:loanId", auth, async (req, res) => {
  const { loanId } = req.params;

  try {
    // Connect to db
    await db.connectDB();
    const dbRef = db.getDatabase().collection("loans");

    // Find loan by id
    const loan = await dbRef.findOne({ _id: new ObjectId(loanId) });
    if (!loan) {
      return res.status(404).json({ error: "Loan not found." });
    }

    // Update loan amt on db
    const result = await dbRef.updateOne(
      { _id: new ObjectId(loanId), status: "pending" },
      { $set: { lender: req.user.email, status: "funded" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: "Loan already funded or not found" });
    }

    // Update loan amt on smart contract
    const tx = await contract.update(loan.amount);
    await tx.wait();
    
    res.status(200).json({ message: "Loan funded successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fund loan" });
  }
});

// This route allows the borrower to repay a portion of the loan amount
router.post("/loans/repay/partial/:loanId", auth, async (req, res) => {
  const { loanId } = req.params;
  const { amount } = req.body;

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Invalid repayment amount." });
  }

  try {
    await db.connectDB();
    const dbRef = db.getDatabase().collection("loans");

    const loan = await dbRef.findOne({ _id: new ObjectId(loanId), borrower: req.user.email });

    if (!loan) {
      return res.status(404).json({ error: "Loan not found or unauthorized." });
    }

    if (loan.status !== "funded") {
      return res.status(400).json({ error: "Only funded loans can be repaid." });
    }

    // Calculate remaining balance
    const remaining = loan.amount - (loan.repaidAmount || 0);
    if (amount > remaining) {
      return res.status(400).json({ error: "Repayment exceeds remaining balance." });
    }

    // Update repayment
    const newRepaidAmount = (loan.repaidAmount || 0) + amount;
    const newStatus = newRepaidAmount >= loan.amount ? "repaid" : "funded";

    const result = await dbRef.updateOne(
      { _id: new ObjectId(loanId) },
      {
        $set: { repaidAmount: newRepaidAmount, status: newStatus }
      }
    );

    const tx = await contract.repayPartial(amount);
    await tx.wait();

    res.status(200).json({ message: `Repayment of ${amount} processed.`, newStatus });
  } catch (err) {
    res.status(500).json({ error: "Failed to process repayment." });
  }
});



// (Maybe not needed) -- marks loan repaid, could be useful for smart contract stuff
// Lets a borrower mark their loan as fully repaid.
router.post("/loans/repay/:loanId", auth, async (req, res) => {
  const { loanId } = req.params;

  try {
    // Connect to db as always
    await db.connectDB();
    const dbRef = db.getDatabase().collection("loans");

    // Find loan by id
    const loan = await dbRef.findOne({
      _id: new ObjectId(loanId),
      borrower: req.user.email
    });

    if (!loan) {
      return res.status(404).json({ error: "Loan not found or unauthorized." });
    }

    if (loan.status !== "funded") {
      return res.status(400).json({ error: "Loan must be funded before it can be repaid." });
    }

    // Update loan's status
    const result = await dbRef.updateOne(
      { _id: new ObjectId(loanId) },
      { $set: { status: "repaid" } }
    );

    // Update loan's smart contract
    const tx = await contract.repay(loan.amount);
    await tx.wait();

    res.status(200).json({ message: "Loan marked as repaid." });
  } catch (err) {
    res.status(500).json({ error: "Failed to repay loan." });
  }
});

// Delete loan request before it's funded
router.delete("/loans/delete/:loanId", auth, async (req, res) => {
  const { loanId } = req.params;

  try {
    // Connect to db
    await db.connectDB();
    const dbRef = db.getDatabase().collection("loans");

    // Find loan's info from id
    const result = await dbRef.deleteOne({
      _id: new ObjectId(loanId),
      borrower: req.user.email,
      status: "pending"
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Loan not found or cannot be deleted." });
    }

    res.status(200).json({ message: "Loan deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete loan." });
  }
});
  

module.exports = router;
