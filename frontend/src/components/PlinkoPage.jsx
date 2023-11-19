import React, { useRef, useState, useEffect } from "react";
import PlinkoGame from "./PlinkoGame";
import GradientButton from "./GradientButton";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "@metamask/sdk-react-ui";
import { plinkoABI, plinkoAddress } from "../contracts/Plinko";
import { useContractEvent } from "@metamask/sdk-react-ui";
import { MetaMaskButton } from "@metamask/sdk-react-ui";
import { useDebounce } from "./useDebounce";

const ControlledInput = (props) => {
  const { value, onChange, ...rest } = props;
  const [cursor, setCursor] = useState();
  const ref = useRef(null);

  useEffect(() => {
    const input = ref.current;
    if (input) {
      input.selectionStart = Number(cursor);
      input.selectionEnd = Number(cursor);
    }
  }, [ref, cursor, value]);

  const handleChange = (e: any) => {
    setCursor(e.target.selectionStart);
    onChange && onChange(e.target.value);
  };

  return <input ref={ref} value={value} onChange={handleChange} {...rest} />;
};

const LabeledInput = (props) => {
  const { label, value, onChange, ...rest } = props;
  const handleChange = (value) => {
    onChange && onChange(value);
  };
  return (
    <div className="flex flex-col text-xs">
      <div className="text-xs text-white pb-1">{label}</div>
      <div
        id="amount-input"
        className="flex flex-row w-full bg-[#141414] rounded-md items-center relative p-2"
      >
        <div className="px-2">ASN</div>
        <ControlledInput
          value={value}
          onChange={handleChange}
          className="flex-1 p-2 focus:outline-none rounded-md bg-[#141414] bg-opacity-20 text-sm"
        />
        <div className="absolute right-5 rounded-lg text-[#6a6a6a] bg-[#1a1a1a] px-2 py-1 cursor-pointer">
          Max
        </div>
      </div>
    </div>
  );
};

const SliderInput = (props) => {
  const { label, onChange, ...rest } = props;
  const [amount, setAmount] = useState(0);
  const [min, max] = [0, 10];
  const handleChange = (e) => {
    if (e.target.value < min || isNaN(e.target.value)) {
      setAmount(min);
      onChange && onChange(min);
      return;
    }
    if (e.target.value > max) {
      setAmount(max);
      onChange && onChange(max);
      return;
    }
    setAmount(e.target.value);
    onChange && onChange(e.target.value);
  };
  return (
    <div className="flex flex-col">
      <div className="text-xs text-white pb-1">{label}</div>
      <div className="flex flex-row gap-4">
        <input
          className="text-white w-[20px] bg-transparent focus:outline-none"
          value={amount}
          onChange={handleChange}
          onBlur={(e) => {
            if (e.target.value === "" || e.target.value === 0)
              handleChange({ target: { value: 1 } });
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          className="flex-1"
          value={amount}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default function PlinkoPage() {
  const plinkoRef = useRef();
  const [numberOfBets, setNumberOfBets] = useState(1);
  const [betAmount, setBetAmount] = useState(0);
  const debouncedBetAmount = useDebounce(betAmount, 500);

  const unwatch = useContractEvent({
    address: plinkoAddress,
    abi: [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "playerAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "ballNumber",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "landingPosition",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "multiplier",
            "type": "uint256"
          }
        ],
        "name": "Ball_Landed_Event",
        "type": "event"
      }
    ],
    eventName: "Ball_Landed_Event",
    listener: (logs) => {
      console.log('listener called')
      const { args } = logs[0];
      console.log('args: ', args);
      console.log('logs: ', logs);
    },
  });

  const { config } = usePrepareContractWrite({
    address: plinkoAddress,
    // abi: plinkoABI.abi,
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "wager",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "risk",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "numRows",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "multipleBets",
            type: "uint256",
          },
        ],
        name: "play",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ],
    functionName: "play",
    args: [betAmount, 0, 8, parseInt(numberOfBets)],
    enabled: Boolean(betAmount),
  });

  const { write, data } = useContractWrite(config);

  console.log("hash", data);

  const receipt = useWaitForTransaction({
    hash: data?.hash,
    onSettled(data) {
      console.log("Success", JSON.stringify(data));
    },
    onError(error) {
      console.log("Error", error);
    },
    timeout: 1000 * 60 * 100,
  });

  const handleClick = async () => {
    write?.();
    console.log("clicked", receipt);
    console.log(numberOfBets);
    if (numberOfBets === 0) return;
    const random_number = [];
    for (let i = 0; i < numberOfBets; i++) {
      random_number.push(Math.floor(Math.random() * 255));
    }
    setTimeout(() => {
      plinkoRef.current.refAddBall(random_number, numberOfBets);
    }, 5000);
    // plinkoRef.current.refAddBall(random_number, numberOfBets);
  };

  const handleNumberOfBetsChange = (value) => {
    setNumberOfBets(value);
  };

  return (
    <div className="flex-1 flex items-center justify-center gap-4">
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
      <PlinkoGame ref={plinkoRef} />
      <div className="px-5 py-5 rounded-xl text-white w-1/4 h-[400px] bg-[#1a1a1a] gap-5 flex flex-col">
        <LabeledInput
          label="Bet Amount"
          className="focus:outline-none rounded-2xl p-1 text-black"
          value={betAmount}
          onChange={setBetAmount}
        />
        <SliderInput
          label="Multiple Bets"
          value={numberOfBets}
          onChange={handleNumberOfBetsChange}
        />
        <GradientButton
          className="h-[50px] w-[100px] flex self-center justify-center items-center mt-auto"
          stroke={2}
          rounded={8}
          onClick={handleClick}
        >
          Play
        </GradientButton>
      </div>
    </div>
  );
}
