require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers")

const { PRIVATE_KEY } = process.env;
const defaultNetwork = "scrollSepolia";

const config = {
  solidity: "0.8.17",

  networks: {
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io/",
      accounts: PRIVATE_KEY !== undefined ? [`0x${PRIVATE_KEY}`] : []
    },
  },
  etherscan: {
    apiKey: {
      scrollSepolia: 'abc',
    },
    customChains: [
      {
        network: 'scrollSepolia',
        chainId: 534351,
        urls: {
          apiURL: 'https://sepolia-blockscout.scroll.io/api',
          browserURL: 'https://sepolia-blockscout.scroll.io/',
        },
      },
    ],
  },
};


module.exports = config;
