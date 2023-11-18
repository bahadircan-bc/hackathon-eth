import React from "react";
import { Link, Outlet } from "react-router-dom";

import { useSDK } from "@metamask/sdk-react";
import { MetaMaskButton } from "@metamask/sdk-react-ui";

export default function Root() {
  const [account, setAccount] = React.useState(null);
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

  return (
    <div className="bg-[#121A2A] w-screen h-screen">
      <div className="w-full h-[50px] bg-[#d9d9d9] flex items-center justify-evenly px-[30%] bg-opacity-50 text-xs text-white fixed">
        <Link
          to={""}
          className="hover:no-underline text-[#f0f0f0] hover:text-[#fff] transition-colors duration-100"
        >
          Home Page
        </Link>
        <Link
          to={"plinko"}
          className="hover:no-underline text-[#f0f0f0] hover:text-[#fff] transition-colors duration-100"
        >
          Plinko
        </Link>
        <div className="text-[#d9d9d9]">Coin Flip</div>
        <Link
          to={"staker"}
          className="hover:no-underline text-[#f0f0f0] hover:text-[#fff] transition-colors duration-100"
        >
          Become A Staker!
        </Link>
        <MetaMaskButton buttonStyle={{position:'absolute', right:100}}/>
      </div>
      <div className="pt-[50px] flex w-screen h-screen">
        <Outlet />
      </div>
    </div>
  );
}
