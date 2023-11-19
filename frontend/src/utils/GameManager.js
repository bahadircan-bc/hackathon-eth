import { useSDK } from "@metamask/sdk-react";
import { plinkoABI, plinkoAddress } from "../contracts/Plinko";
// import { Contract, Signer, ethers } from "ethers";

const usePlinko = () => {
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const signer = provider.getSigner();
  // const plinkoContract = new ethers.Contract(plinkoAddress, plinkoABI, signer);
  // return plinkoContract;
  // // const contract = new ethers.Contract(plinkoAddress, plinkoABI, signer);
  // const play = async (wager, risk, numRows, multipleBets) => {
  //   const tx = await contract.play(wager, risk, numRows, multipleBets);
  //   const receipt = await tx.wait();
  //   return receipt;
  // };
  // const subscribe = (cb) => {
  //   contract.on(
  //     "Ball_Landed_Event",
  //     (playerAddress, ballNumber, landingPosition, multiplier) => {
  //       cb(playerAddress, ballNumber, landingPosition, multiplier);
  //     }
  //   );
  // };
  // console.log('contract: ', contract)
  // return { contract, play, subscribe };
};

export default usePlinko;
