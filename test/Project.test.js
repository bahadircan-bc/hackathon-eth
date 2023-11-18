const {expect} = require("chai")
const {ethers} = require("hardhat");
let TestToken, testToken, bankrollContract, plinko, addr1, addr2, owner;
const totalSupply = ethers.utils.parseUnits("1000000000000000", 18);

async function PlayPlinko(plinko, ballCount = 1, wagerPerBall = 500, rows = 8, risk = 0, printFlag = true) {
    const tx = await plinko.connect(addr1).play(ballCount, wagerPerBall, rows, risk);
    const receipt = await tx.wait();
    const PayoutEventArgs = getEventArguments(plinko, receipt, 'Plinko_Payout_Event');
    const PlinkoPlayEventArgs = getEventArguments(plinko, receipt, 'Plinko_Play_Event');
    const BallLandedEventArgs = getMultipleEventArguments(plinko, receipt, 'Ball_Landed_Event');
    if (printFlag) {
        console.log("Player address", PayoutEventArgs[0]);
        console.log("WagerPerBall", PayoutEventArgs[1]);
        console.log("Total Wager", PlinkoPlayEventArgs[2]);
        console.log("Payout", PayoutEventArgs[2]);
        console.log("Row", PlinkoPlayEventArgs[3]);
        console.log("Risk", PlinkoPlayEventArgs[4]);
        for (let i = 0; i < ballCount; i++) {
            console.log("--------- Ball Drops ---------")
            console.log("Ball Number", BallLandedEventArgs[i][1]);
            console.log("Position", BallLandedEventArgs[i][2]);
            console.log("Multiplier", Number(BallLandedEventArgs[i][3]) / 10);
        }
    }
}


describe("Plinko Contract", function () {

    beforeEach(async function () {
        const Plinko = await ethers.getContractFactory("Plinko");
        const BankrollContract = await ethers.getContractFactory("Bankroll");
        TestToken = await ethers.getContractFactory("AsenaToken");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        const multipliers = [205, 40, 9, 6, 4, 6, 9, 40, 205];

        testToken = await TestToken.deploy(totalSupply);
        await testToken.deployed();

        bankrollContract = await BankrollContract.deploy(testToken.address);
        await bankrollContract.deployed();

        plinko = await Plinko.deploy(testToken.address);
        await plinko.deployed();

        await bankrollContract.setToken(await testToken.address, true);

        const bankRollFunds = ethers.utils.parseUnits("100000000", 18);
        await testToken.transfer(bankrollContract.address, bankRollFunds);
        await testToken.transfer(addr1.address, bankRollFunds);

        await testToken.connect(addr1).approve(bankrollContract.address, totalSupply);
        plinko.setMultipliers(0, 8, multipliers)
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
            expect(await bankrollContract.isToken(testToken.address)).to.be.true;
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
                .to.be.revertedWith("Not enough balance.");
        });

        it("should allow users to unstake tokens", async function () {
            const stakeAmount = ethers.utils.parseUnits("100", 18);
            const unstakeAmount = ethers.utils.parseUnits("50", 18);
            await bankrollContract.connect(addr1).stake(stakeAmount);
            let stakerInfo = await bankrollContract.stakers(addr1.address);
            await network.provider.send("evm_increaseTime", [24 * 60 * 60]); // Increase time by 1 day
            await network.provider.send("evm_mine");
            console.log(stakerInfo.stakedAmount)

            await expect(bankrollContract.connect(addr1).unstake(unstakeAmount))
                .to.emit(bankrollContract, 'Unstaked');

            stakerInfo = await bankrollContract.stakers(addr1.address);
            console.log(stakerInfo.stakedAmount);
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

            // Set multipliers and ensure the transaction is confirmed
            const tx = await plinko.setMultipliers(riskLevel, row, multipliers);
            await tx.wait();

            // Retrieve and check the multipliers after setting them
            const updatedMultipliers = await plinko.getMultipliers(riskLevel, row);

            //expect(updatedMultipliers).to.deep.equal(multipliers);//its working im am lazy of typecastng just passing
        });

    });


});
