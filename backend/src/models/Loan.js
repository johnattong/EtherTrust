require('dotenv').config({ path: '../../.env' });
const db = require('../../server');


// add loans to database
const addLoans = async (borrower, lender, amount, interestRate, duration, status, createdAt) => {
    try{
        const loanData = populateLoans(borrower, lender, amount, interestRate, duration, status, createdAt);
        // Connect to the database and then insert into user table
        await db.connectDB();
        const userCollection = db.getDatabase().collection('loans');
        const result = await userCollection.insertOne(loanData);
        console.log("Loan created in database", result);
    } catch (error){
        console.log(error);
    }
}

// populate loan fields
const populateLoans = async (borrower, lender, amount, interestRate, duration, status, createdAt) => {
    try {
        const loan = {
            borrower: borrower,
            lender: lender,
            amount: amount,
            interestRate: interestRate,
            duration: duration,
            status: status,
            createdAt: createdAt
        };
        console.log("Loan fields populated successfully.");
        return loan;
    } catch (error){
        console.log("Error populating loan fields\n", error);
    }
};

module.exports = addLoans;