require("dotenv").config();
const { ethers } = require("ethers");

const contractABI = [
  "function update(int256 newAmt) public",
  "function repay(int256 repaidAmt) public",
  "event UpdatedLoanAmt(int256 oldAmt, int256 newAmt)",
  "event LoanRepaid(address indexed borrower, int256 repaidAmt)"
];

const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, signer);

module.exports = contract;
