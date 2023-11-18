const {ethers} = require("hardhat");
const initialSupply = ethers.utils.parseUnits("10000000000000000", 18);
const bankRollFunds = ethers.utils.parseUnits("100000000", 18);

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const TestToken = await ethers.getContractFactory("AsenaToken");
    const testToken = await TestToken.deploy(initialSupply);

    const Plinko = await ethers.getContractFactory("Plinko");
    const plinko = await Plinko.deploy(testToken.address);
    await plinko.deployed();

    const BankrollContract = await ethers.getContractFactory("Bankroll");

    const bankrollContract = await BankrollContract.deploy(testToken.address);
    await bankrollContract.deployed();

    await bankrollContract.setToken(await testToken.address, true);

    await testToken.transfer(bankrollContract.address, bankRollFunds);

    console.log("testToken address:", testToken.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });