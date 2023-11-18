import React from "react";
import { motion } from "framer-motion";

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
      <StakeInformationCol label="Harvestable Funds" value="world" />
      <StakeInformationCol label="ASN Staked" value="world" />
      <StakeInformationCol label="Your Share" value="world" />
      <StakeInformationCol label="APY" value="world" />
      <StakeInformationCol label="Bankroll Balance" value="world" />
    </div>
  );
};

export default function StakerPage() {
  const bankrollVolume = 0;
  const userStaked = 0;
  const userProfit = 0;
  const tokenSymbol = "ASN";
  const userBalance = 0;
  const [stakeAmount, setStakeAmount] = React.useState(0);
  const [harvestAmount, setHarvestAmount] = React.useState(0);

  const [stakeWindowOn, setStakeWindowOn] = React.useState(true);
  const [harvestWindowOn, setHarvestWindowOn] = React.useState(false);
  const [unstakeWindowOn, setUnstakeWindowOn] = React.useState(false);

  return (
    <div
      id="window-container"
      className="bg-darker w-full h-full flex items-center justify-center"
    >
      <div
        id="card"
        className="w-1/3 aspect-[9/12] text-[#6a6a6a] rounded-lg flex flex-col"
      >
        <div id="card-header" className="flex flex-row w-full text-center">
          <div
            className={`p-2 rounded-t-lg border-r border-t min-w-[20%] border-dark text-sm ${
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
            className={`p-2 rounded-t-lg border-r border-t min-w-[20%] border-dark text-sm ${
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
          <div
            className={`p-2 rounded-t-lg border-r border-t min-w-[20%] border-dark text-sm ${
              harvestWindowOn ? "bg-[#1a1a1a] text-white" : "bg-[#141414]"
            } cursor-pointer`}
            onClick={() => {
              setStakeWindowOn(false);
              setHarvestWindowOn(true);
              setUnstakeWindowOn(false);
            }}
          >
            Harvest
          </div>
        </div>
        <div
          id="card-container"
          className="bg-[#1a1a1a] flex-1 rounded-b-lg rounded-tr-lg p-5 flex flex-col"
        >
          <div className="text-sm">
            <div className="flex mb-1">
              <div>Select Amount</div>
              <div className="ml-auto text-xs">Balance: 0</div>
            </div>
            <AmountInput />
          </div>
          <StakeInformation />
          <div className="w-full text-center bg-white p-2 mt-4 rounded-lg text-black">
            Stake
          </div>
        </div>
      </div>
    </div>
  );
}
