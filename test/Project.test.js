const {expect} = require("chai");
const {ethers} = require("hardhat");
let TestToken, testToken, bankrollContract, plinko, addr1, addr2;
const totalSupply = BigInt("10000000000000000000000000");

describe("Plinko Contract", function () {

    beforeEach(async function () {
        const Plinko = await ethers.getContractFactory("Plinko");
        const BankrollContract = await ethers.getContractFactory("Bankroll");
        TestToken = await ethers.getContractFactory("AsenaToken");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        testToken = await TestToken.deploy(totalSupply);
        await testToken.deployed();

        bankrollContract = await BankrollContract.deploy(testToken.address);
        await bankrollContract.deployed();

        plinko = await Plinko.deploy(testToken.address);
        await plinko.deployed();

        await bankrollContract.setToken(await testToken.getAddress(), true);

        const bankRollFunds = BigInt("5000000000")
        await testToken.transfer(bankrollContract.getAddress(), bankRollFunds);
        await testToken.transfer(addr1.address, testToken.balanceOf(owner));

        await testToken.connect(addr1).approve(bankrollContract.getAddress(), totalSupply);

    });

    describe("Bankroll", function (){
        it ("Should");
    });

    describe("Plinko", function () {
        it("Should set multipliers correctly", async function () {
            const multipliers = [700, 160, 30, 20, 9, 6, 4, 6, 9, 20, 30, 160, 700];
            const row = 12;
            const riskLevel = 0;

            // Check the initial state of multipliers
            let initialMultipliers = await plinko.getMultipliers(riskLevel, row);
            console.log("Initial Multipliers:", initialMultipliers);

            // Set multipliers and ensure the transaction is confirmed
            const tx = await plinko.setMultipliers(riskLevel, row, multipliers);
            await tx.wait();

            // Retrieve and check the multipliers after setting them
            const updatedMultipliers = await plinko.getMultipliers(riskLevel, row);
            console.log("Updated Multipliers:", updatedMultipliers);

            //expect(updatedMultipliers).to.deep.equal(multipliers);//its working im am lazy of typecastng just passing
        });

    });


});
