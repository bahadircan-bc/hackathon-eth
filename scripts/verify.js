const hre = require("hardhat");
const initialSupply = ethers.utils.parseUnits("10000000000000000", 18);

async function main() {
    const contracts = [
        { address: '0x9aed25bfb35432c7d04c2209ffccb19f1aea01b5', constructorArguments: [initialSupply] }, //token
        { address: '0x97d86c61a270c2130025f156b65a1570ccb4bc4d', constructorArguments: ['0x9aed25bfb35432c7d04c2209ffccb19f1aea01b5'] }, //plinko
        { address: '0x0225F69f7aeA27DDCE8dF5dDFd39B92C6264C9ae', constructorArguments: ['0x9aed25bfb35432c7d04c2209ffccb19f1aea01b5'] }, //bankroll
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
