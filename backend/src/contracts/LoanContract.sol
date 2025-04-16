pragma solidity >=0.8.10;
contract Loan {
    event UpdatedLoanAmt(int oldAmt, int newAmt);
    event LoanRepaid(address indexed borrower, int repaidAmt);

    int public LoanAmt;
    address public borrower;

    constructor(int memory initLoanAmt) {
        LoanAmt = initLoanAmt;
    }

    function update(int memory newAmt) public {
        int memory oldAmt = LoanAmt;
        LoanAmt = newAmt;
        emit UpdatedLoanAmt(oldAmt, newAmt);
    }

    function repay(int repaidAmt) public {
        require(repaidAmt > 0, "Repayment must be greater than zero");
        emit LoanRepaid(msg.sender, repaidAmt);
    }
}