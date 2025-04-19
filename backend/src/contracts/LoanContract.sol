pragma solidity >=0.8.10;
contract Loan {
    event UpdatedLoanAmt(int oldAmt, int newAmt);
    event LoanRepaid(address indexed borrower, int repaidAmt);
    event PartialRepayment(address indexed borrower, int256 amount, int256 totalRepaid);

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

    function repayPartial(int256 amount) public {
        require(amount > 0, "Partial amount must be positive");
        TotalRepaid += amount;
        emit PartialRepayment(msg.sender, amount, TotalRepaid);
    }
}