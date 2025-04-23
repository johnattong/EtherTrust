
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Loan {
    address public borrower;
    address public lender;
    uint256 public amount;
    uint256 public interestRate;
    uint256 public duration;
    uint256 public repaidAmount;
    bool public isFunded;
    bool public isRepaid;

    constructor(address _borrower, uint256 _amount, uint256 _interestRate, uint256 _duration) {
        borrower = _borrower;
        amount = _amount;
        interestRate = _interestRate;
        duration = _duration;
        repaidAmount = 0;
        isFunded = false;
        isRepaid = false;
    }

    function fundLoan() public {
        require(!isFunded, "Loan already funded");
        lender = msg.sender;
        isFunded = true;
    }

    function repay(uint256 payment) public {
        require(msg.sender == borrower, "Only borrower can repay");
        require(isFunded, "Loan must be funded");
        require(!isRepaid, "Loan already repaid");

        repaidAmount += payment;
        if (repaidAmount >= amount) {
            isRepaid = true;
        }
    }

    function getSummary() public view returns (address, address, uint256, uint256, uint256, uint256, bool, bool) {
        return (borrower, lender, amount, interestRate, duration, repaidAmount, isFunded, isRepaid);
    }
}
