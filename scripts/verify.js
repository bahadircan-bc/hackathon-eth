const hre = require("hardhat");
const initialSupply = ethers.utils.parseUnits("10000000000000000", 18);

async function main() {
    const contracts = [
        { address: '0x73d910c167eD88e6be217f5a006FfA291b3eeaef', constructorArguments: [initialSupply] }, //token
        { address: '0xc4651cd64d8b68f957371cc08a114430f4bfc449', constructorArguments: ['0x73d910c167eD88e6be217f5a006FfA291b3eeaef'] }, //plinko
        { address: '0xF1fbD98Ac8727e88469292B8b87A65B4f7695bC0', constructorArguments: ['0x73d910c167eD88e6be217f5a006FfA291b3eeaef'] }, //bankroll
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
