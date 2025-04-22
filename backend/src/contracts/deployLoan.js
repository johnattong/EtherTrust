
const hre = require("hardhat");

async function deployLoan(borrower, amount, interestRate, duration) {
  const LoanContract = await hre.ethers.getContractFactory("Loan");

  const contract = await LoanContract.deploy(
    borrower,
    amount,
    interestRate,
    duration
  );

  await contract.deployed();
  return contract.address;
}

module.exports = { deployLoan };

