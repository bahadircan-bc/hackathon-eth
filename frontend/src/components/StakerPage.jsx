import React from "react";
import { motion } from "framer-motion";
import {
  MetaMaskButton,
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useSDK,
} from "@metamask/sdk-react-ui";
import { bankrollAddress } from "../contracts/Bankroll";
import { useDebounce } from "./useDebounce";

const useGetContractFunction = (address, abi, functionName, args) => {
  const { config } = usePrepareContractWrite({
    address: bankrollAddress,
    abi: abi,
    functionName: functionName,
    args: args,
  });
  const { write } = useContractWrite(config);
  return write;
};

const AmountInput = (props) => {
  return (
    <div
      id="amount-input"
      className="flex flex-row w-full bg-[#141414] rounded-md items-center relative p-2"
    >
      <div className="px-2">ASN</div>
      <input className="flex-1 p-2 focus:outline-none rounded-md bg-[#141414] bg-opacity-20" />
      <div className="absolute right-5 rounded-lg text-[#6a6a6a] bg-[#1a1a1a] px-2 py-1 cursor-pointer">
        Max
      </div>
    </div>
  );
};

const StakeInformationCol = (props) => {
  const { label, value, ...rest } = props;
  return (
    <div
      className="odd:bg-[#262626] flex flex-row p-2 rounded-lg text-xs"
      {...rest}
    >
      <div>{label}</div>
      <div className="ml-auto text-white">{value}</div>
    </div>
  );
};

const StakeInformation = (props) => {
  return (
    <div className="flex flex-col mt-auto text-[#6a6a6a]">
      <StakeInformationCol label="Harvestable Funds" value="--" />
      <StakeInformationCol label="ASN Staked" value="--" />
      <StakeInformationCol label="Your Share" value="--" />
      <StakeInformationCol label="APY" value="--" />
      <StakeInformationCol label="Bankroll Balance" value="--" />
    </div>
  );
};

export default function StakerPage() {
  const bankrollVolume = 0;
  const userStaked = 0;
  const userProfit = 0;
  const tokenSymbol = "ASN";
  const userBalance = 0;
  const [value, setValue] = React.useState(0);
  const debouncedValue = useDebounce(value, 500);
  const onChange = (e) => {
    setValue(e.target.value);
  };

  const stake = usePrepareContractWrite({
    address: bankrollAddress,
    abi: [
      {
        inputs: [
          {
            'internalType': "uint256",
            'name': "_amount",
            'type': "uint256",
          },
        ],
        name: "stake",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "stake",
    args: [debouncedValue],
  });
  console.log(stake);
  const stakeContract = useContractWrite(stake.config)
  console.log(stakeContract)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: stakeContract.data?.hash,
  })

  const [stakeWindowOn, setStakeWindowOn] = React.useState(true);
  const [harvestWindowOn, setHarvestWindowOn] = React.useState(false);
  const [unstakeWindowOn, setUnstakeWindowOn] = React.useState(false);

  // const { account } = useSDK();
  // console.log(account);
  // const { data } = useBalance({ account: account, watch: true });
  console.log(stakeContract.data);

  const handleClick = () => {
    if (stakeWindowOn) {
      stakeContract.write();
    } else if (unstakeWindowOn) {
      // handleUnstake();
    } else if (harvestWindowOn) {
      console.log("harvest");
    }
  };
  return (
    <div
      id="window-container"
      className="bg-darker w-full h-full flex items-center justify-center"
    >
      <MetaMaskButton
        buttonStyle={{
          position: "absolute",
          top: 3,
          right: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
      <div
        id="card"
        className="w-1/3 aspect-[9/12] text-[#6a6a6a] rounded-lg flex flex-col relative"
      >
        <div id="card-header" className="flex flex-row w-full text-center">
          <div
            className={`p-2 rounded-tl-lg flex-1 text-sm ${
              stakeWindowOn ? "bg-[#1a1a1a] text-white" : "bg-[#141414]"
            } cursor-pointer`}
            onClick={() => {
              setStakeWindowOn(true);
              setHarvestWindowOn(false);
              setUnstakeWindowOn(false);
            }}
          >
            Stake
          </div>
          <div
            className={`p-2 rounded-tr-lg flex-1 text-sm ${
              unstakeWindowOn ? "bg-[#1a1a1a] text-white" : "bg-[#141414]"
            } cursor-pointer`}
            onClick={() => {
              setStakeWindowOn(false);
              setHarvestWindowOn(false);
              setUnstakeWindowOn(true);
            }}
          >
            Unstake
          </div>
        </div>
        <div
          id="card-container"
          className="bg-[#1a1a1a] flex-1 rounded-b-lg p-5 flex flex-col "
        >
          <div className="text-sm">
            <div className="flex mb-1">
              <div>Select Amount</div>
              <div className="ml-auto text-xs">Balance: 0</div>
            </div>
            <AmountInput value={value} onChange={onChange} />
          </div>
          <StakeInformation />
          <div
            className="w-full text-center bg-white p-2 mt-4 rounded-lg text-black cursor-pointer"
            onClick={handleClick}
          >
            {stakeWindowOn
              ? "Stake"
              : unstakeWindowOn
              ? "Unstake"
              : harvestWindowOn
              ? "Harvest"
              : null}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-1/2 h-2/5 -translate-x-[calc(100%_+_4px)] rounded-xl bg-[#1a1a1a] flex flex-col text-center items-center justify-center px-4 py-12">
          Harvestable Tokens: <br /> 0 ASN
          <div className="cursor-pointer mt-auto bg-white text-black p-1 w-full rounded-lg text-sm">
            Harvest
          </div>
        </div>
      </div>
    </div>
  );
}
