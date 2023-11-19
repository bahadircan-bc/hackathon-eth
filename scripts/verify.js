const hre = require("hardhat");
const {ethers} = require("hardhat");
const initialSupply = ethers.utils.parseUnits("10000000000000000", 18);

async function main() {
    const contracts = [
        { address: '0x6Da1C252c2B3e5dF9479aBA29Cd4e871db472e90', constructorArguments: [initialSupply] }, //token
        { address: '0xb58775Af4ec3Fc6307421be05b7f17A2042cB839', constructorArguments: ['0x6Da1C252c2B3e5dF9479aBA29Cd4e871db472e90'] }, //plinko
        { address: '0xa5E4c1e19471A753C447e728DD2722a93bfDC34C', constructorArguments: ['0x6Da1C252c2B3e5dF9479aBA29Cd4e871db472e90'] }, //bankroll
    ];

    for (let contract of contracts) {
        try {
            await hre.run("verify:verify", {
                address: contract.address,
                constructorArguments: contract.constructorArguments,
            });
            console.log(`Verified: ${contract.address}`);
        } catch (e) {
            console.error(`Verification failed for ${contract.address}: ${e.message}`);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
