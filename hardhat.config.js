require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers")
require("@nomiclabs/hardhat-etherscan");


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
      scrollSepolia: 'A95MIC2SCSW6ETX8IBAKAKXGKSM5PC5YDV',
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
