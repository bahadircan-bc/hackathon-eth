const { expect } = require("chai");
const { ethers } = require("hardhat");
let TestToken, testToken, plinko, addr1, addr2;
const totalSupply = BigInt("10000000000000000000000000");

describe("Plinko Contract", function () {
    let Plinko;
    let plinkoContract;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        Plinko = await ethers.getContractFactory("Plinko");
        TestToken = await ethers.getContractFactory("AsenaToken");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        const multipliers = [205, 40, 9, 6, 4, 6, 9, 40, 205];
        plinko = await Plinko.deploy(testToken);
        testToken = await TestToken.deploy(totalSupply);
        await testToken.connect(addr1).approve(plinko.getAddress(), totalSupply);
    });

});