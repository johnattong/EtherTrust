import {ethers} from "ethers";

async function main() {
    const Loan = await ethers.getContractFactory("Loan");

    // Start deployment, returning a promise that resolves to a contract object
    const loan = await Loan.deploy("Loan");
    console.log("Contract deployed to address:", loan.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });