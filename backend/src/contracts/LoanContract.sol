pragma solidity >=0.8.10;
contract Loan {
    event UpdatedLoanAmt(int oldAmt, int newAmt);
    int public LoanAmt;

    constructor(int memory initLoanAmt) {
        LoanAmt = initLoanAmt;
    }

    function update(int memory newAmt) public {
        int memory oldAmt = LoanAmt;
        LoanAmt = newAmt;
        emit UpdatedLoanAmt(oldAmt, newAmt);
    }
}