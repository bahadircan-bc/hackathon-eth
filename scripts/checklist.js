const {ethers} = require("hardhat");
const initialSupply = ethers.utils.parseUnits("10000000000000000", 18);
const bankRollFunds = ethers.utils.parseUnits("100000000", 18);

const plinkoABI = require("../artifacts/contracts/Plinko.sol/Plinko.json").abi;
const tokenABI = require("../artifacts/contracts/Token.sol/WiserUSD.json").abi;
const bankrollABI = require("../artifacts/contracts/CommunityBankroll.sol/Bankroll.json").abi;

const plinkoAddress = "0xb58775Af4ec3Fc6307421be05b7f17A2042cB839";
const bankrollAddress = "0xa5E4c1e19471A753C447e728DD2722a93bfDC34C";
const tokenAddress = "0x6Da1C252c2B3e5dF9479aBA29Cd4e871db472e90";

async function main() {
    const [owner] = await ethers.getSigners();
    const plinko = new ethers.Contract(plinkoAddress, plinkoABI, owner);
    const token = new ethers.Contract(tokenAddress, tokenABI, owner);
    const bankroll = new ethers.Contract(bankrollAddress, bankrollABI, owner);

    const tx = await token.approve(plinkoAddress, ethers.utils.parseUnits("1000000000000", 18));
    await tx.wait();
    await token.approve(bankrollAddress, ethers.utils.parseUnits("1000000000000", 18));
    await plinko.setBankroll(bankrollAddress);
    await bankroll.setToken(tokenAddress, true);
    await bankroll.setGame(plinkoAddress, true);
    console.log(bankroll.isGame(plinkoAddress));
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });