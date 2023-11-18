import React from "react";
import { motion } from "framer-motion";

export default function StakerPage() {
  const bankrollVolume = 0;
  const userStaked = 0;
  const userProfit = 0;
  const tokenSymbol = "ASN";
  const userBalance = 0;
  const [stakeAmount, setStakeAmount] = React.useState(0);
  const [harvestAmount, setHarvestAmount] = React.useState(0);

  const [stakeWindowOn, setStakeWindowOn] = React.useState(false);
  const [harvestWindowOn, setHarvestWindowOn] = React.useState(false);
  const [leaveWindowOn, setLeaveWindowOn] = React.useState(false);

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="border p-5 rounded-xl text-white w-1/4 h-[400px] bg-[#010101] bg-opacity-20 gap-5 flex flex-col text-lg mr-4">
        Hello Staker!
        <div className="flex-1 flex flex-col justify-evenly text-sm text-[#d9d9d9]">
          <div>Total volume of Bankroll: </div>
          <div className="self-end">
            {bankrollVolume} {tokenSymbol}
          </div>
          <div>Total staked: </div>
          <div className="self-end">
            {userStaked} {tokenSymbol}
          </div>
          <div>Profit: </div>
          <div className="self-end">
            {userProfit} {tokenSymbol}
          </div>
        </div>
      </div>
      <div className="border p-5 rounded-xl text-white w-1/4 h-[400px] bg-[#010101] bg-opacity-20 gap-5 flex flex-col mr-4">
        <div className="w-full h-full flex flex-col justify-evenly items-center">
          <div
            className="w-full border rounded-lg text-center py-2"
            onClick={() => {
              setHarvestWindowOn(false);
              setStakeWindowOn(!stakeWindowOn);
            }}
          >
            Stake
          </div>
          <div
            className="w-full border rounded-lg text-center py-2"
            onClick={() => {
              setStakeWindowOn(false);
              setHarvestWindowOn(!harvestWindowOn);
            }}
          >
            Harvest
          </div>
          <div
            className="w-full border rounded-lg text-center py-2 bg-red-500"
            onClick={() => {
              setLeaveWindowOn(!leaveWindowOn);
            }}
          >
            Unstake
          </div>
        </div>
      </div>
      <motion.div
        initial={{ width: 0, border: 1 }}
        animate={
          stakeWindowOn
            ? { width: "25%", border: "1px solid white", opacity: 1 }
            : { width: 0, border: "none", opacity: 0 }
        }
        className="rounded-xl text-white w-1/4 h-[400px] bg-[#010101] bg-opacity-20 flex flex-col overflow-hidden"
      >
        <div className="p-5 flex flex-col items-center justify-evenly h-full w-full flex-nowrap whitespace-nowrap">
          <div>Stake</div>
          <div>
            {stakeAmount} {tokenSymbol}
          </div>
          <input type="range" className="w-full" />
          <div className="w-full border rounded-lg text-center py-2 bg-green-500">
            Confirm
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ width: 0, border: 1 }}
        animate={
          harvestWindowOn
            ? { width: "25%", border: "1px solid white", opacity: 1 }
            : { width: 0, border: "none", opacity: 0 }
        }
        className="rounded-xl text-white w-1/4 h-[400px] bg-[#010101] bg-opacity-20 flex flex-col overflow-hidden"
      >
        <div className="p-5 flex flex-col items-center justify-evenly h-full w-full flex-nowrap whitespace-nowrap">
          <div>Harvest</div>
          <div>
            {harvestAmount} {tokenSymbol}
          </div>
          <input type="range" className="w-full" />
          <div className="w-full border rounded-lg text-center py-2 bg-green-500">
            Confirm
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ width: 0, border: 1 }}
        animate={
          leaveWindowOn
            ? { width: "25%", border: "1px solid white", opacity: 1 }
            : { width: 0, border: "none", opacity: 0 }
        }
        className="rounded-xl text-white w-1/4 h-[400px] bg-[#010101] bg-opacity-20 flex flex-col overflow-hidden"
      >
        <div className="p-5 flex flex-col items-center justify-evenly h-full w-full flex-nowrap whitespace-nowrap">
          <div>Unstake</div>
          <div>Are you sure you want to unstake?</div>
          <div className="w-full border rounded-lg text-center py-2 bg-red-500">
            Confirm
          </div>
        </div>
      </motion.div>
    </div>
  );
}
