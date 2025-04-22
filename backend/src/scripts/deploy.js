/*
//scripts/deploy.js is for commandline deployment, not backend deployment
const hre = require("hardhat");

async function main() {
  // Replace these with test values or args
  const borrower = "0x1234...";         // borrower Ethereum address
  const amount = 1000;                  // principal amount
  const interestRate = 10;              // in percent
  const duration = 12;                  // in months or blocks, depending on contract logic

  const Loan = await hre.ethers.getContractFactory("Loan");
  const loan = await Loan.deploy(borrower, amount, interestRate, duration);

  await loan.deployed();

  console.log(`Loan contract deployed to: ${loan.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

 */