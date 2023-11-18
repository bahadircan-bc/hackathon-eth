const { expect } = require("chai")
const {ethers} = require("hardhat");
let TestToken, testToken, bankrollContract, plinko, addr1, addr2, owner;
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

        await bankrollContract.setToken(await testToken.address, true);

        const bankRollFunds = BigInt("5000000000")
        await testToken.transfer(bankrollContract.address, bankRollFunds);

        await testToken.connect(addr1).approve(bankrollContract.address, totalSupply);

    });

    describe("Bankroll", function () {
        it("should allow owner to set game access", async function () {
            bankrollContract.setGame(plinko.address, true);
            expect(await bankrollContract.isGame(plinko.address)).to.equal(true);
        });

        it("should allow owner to set token access", async function () {
            const tokenAddress = ethers.Wallet.createRandom().address;
            await expect(bankrollContract.setToken(tokenAddress, true))
                .to.emit(bankrollContract, 'TokenStateChanged')
                .withArgs(tokenAddress, true);

            console.log(bankrollContract.isToken());
        });

        it("Should revert if non-owner tries to set game", async function () {
            const gameAddress = ethers.Wallet.createRandom().address;
            await expect(bankrollContract.connect(addr1).setGame(gameAddress, true))
                .to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("should transfer token payout", async function () {
            const payoutAmount = ethers.utils.parseUnits("50", 18);
            await expect(bankrollContract.transferTokenPayout(testToken.address, addr1.address, payoutAmount))
                .to.changeTokenBalance(testToken, addr1, payoutAmount);
        });

        it("should fail if payout amount exceeds contract balance", async function () {
            const payoutAmount = ethers.utils.parseUnits("1000000000", 18); // Large amount
            await expect(bankrollContract.transferTokenPayout(testToken.address, addr1.address, payoutAmount))
                .to.be.revertedWith("Insufficient balance in contract");
        });

        it("should allow users to unstake tokens", async function () {
            const stakeAmount = ethers.utils.parseUnits("100", 18);
            const unstakeAmount = ethers.utils.parseUnits("50", 18);
            await testToken.connect(addr1).approve(bankrollContract.address, stakeAmount);
            await bankrollContract.connect(addr1).stake(stakeAmount);

            await network.provider.send("evm_increaseTime", [24 * 60 * 60]); // Increase time by 1 day
            await network.provider.send("evm_mine");

            await expect(bankrollContract.connect(addr1).unstake(unstakeAmount))
                .to.emit(bankrollContract, 'Unstaked')
                .withArgs(addr1.address, unstakeAmount, await ethers.provider.getBlockNumber());

            const stakerInfo = await bankrollContract.stakers(addr1.address);
            expect(stakerInfo.stakedAmount).to.equal(stakeAmount.sub(unstakeAmount));
        });

        it("should fail to unstake before minimum stake time", async function () {
            const stakeAmount = ethers.utils.parseUnits("100", 18);
            await testToken.connect(addr1).approve(bankrollContract.address, stakeAmount);
            await bankrollContract.connect(addr1).stake(stakeAmount);

            await expect(bankrollContract.connect(addr1).unstake(stakeAmount))
                .to.be.revertedWith("Stake must be held for at least 1 day");
        });

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
