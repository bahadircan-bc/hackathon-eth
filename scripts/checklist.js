const {ethers} = require("hardhat");
const initialSupply = ethers.utils.parseUnits("10000000000000000", 18);
const bankRollFunds = ethers.utils.parseUnits("100000000", 18);

const plinkoABI = require("../artifacts/contracts/Plinko.sol/Plinko.json").abi;
const tokenABI = require("../artifacts/contracts/Token.sol/AsenaToken.json").abi;
const bankrollABI = require("../artifacts/contracts/CommunityBankroll.sol/Bankroll.json").abi;

const plinkoAddress = "0xc4651cd64d8b68f957371cc08a114430f4bfc449";
const bankrollAddress = "0xF1fbD98Ac8727e88469292B8b87A65B4f7695bC0";
const tokenAddress = "0x73d910c167eD88e6be217f5a006FfA291b3eeaef";

async function main() {
    const [owner] = await ethers.getSigners();
    const plinko = new ethers.Contract(plinkoAddress, plinkoABI, owner);
    const token = new ethers.Contract(tokenAddress, tokenABI, owner);
    const bankroll = new ethers.Contract(bankrollAddress, bankrollABI, owner);

    token.approve(plinkoAddress, ethers.utils.parseUnits("1000000000000", 18));
    token.approve(bankrollAddress, ethers.utils.parseUnits("1000000000000", 18));
    plinko.setBankroll(bankrollAddress);
    bankroll.setToken(tokenAddress, true);
    bankroll.setGame(plinkoAddress, true);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });