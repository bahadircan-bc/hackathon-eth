import React, { useRef, useState, useEffect } from "react";
import PlinkoGame from "./PlinkoGame";
import GradientButton from "./GradientButton";

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
  const { label, ...rest } = props;
  return (
    <div className="flex flex-col">
      <div className="text-xs text-white pb-1">{label}</div>
      <ControlledInput {...rest} />
    </div>
  );
};

const SliderInput = (props) => {
  const { label, onChange, ...rest } = props;
  const [amount, setAmount] = useState(0);
  const [min, max] = [0, 10];
  const handleChange = (e) => {
    if (e.target.value < min) {
      setAmount(min);
      onChange && onChange(min);
      return;
    }
    if (e.target.value > max) {
      setAmount(max);
      onChange && onChange(max);
      return;
    }
    if (isNaN(e.target.value)) {
      setAmount(min);
      onChange && onChange(min);
      return;
    }
    setAmount(e.target.value);
    onChange && onChange(e.target.value);
  };
  return (
    <div className="flex flex-col">
      <div className="text-xs text-white pb-1">{label}</div>
      <div className="flex flex-row gap-4">
        {/* <div className="min-w-[20px]">{amount}</div> */}
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
  const [betAmount, setBetAmount] = useState(0);
  const [numberOfBets, setNumberOfBets] = useState(1);
  const handleClick = () => {
    console.log(numberOfBets);
    if (numberOfBets === 0) return;
    const random_number = [];
    for (let i = 0; i < numberOfBets; i++) {
      random_number.push(Math.floor(Math.random() * 255));
    }
    plinkoRef.current.refAddBall(random_number, numberOfBets);
  };
  const handleNumberOfBetsChange = (value) => {
    setNumberOfBets(value);
  };
  return (
    <div className="flex-1 flex items-center justify-center gap-4">
      <PlinkoGame ref={plinkoRef} />
      <div className="border px-5 py-5 rounded-xl text-white w-1/4 h-[400px] bg-[#010101] bg-opacity-20 gap-5 flex flex-col">
        <LabeledInput
          label="Bet Amount"
          className="focus:outline-none rounded-2xl p-1 text-black"
        />
        <SliderInput
          label="Multiple Bets"
          onChange={handleNumberOfBetsChange}
        />
        <GradientButton
          className="h-[50px] w-[100px] flex self-center justify-center items-center"
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
