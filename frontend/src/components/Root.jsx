import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

import { useSDK } from "@metamask/sdk-react";
import { MetaMaskButton } from "@metamask/sdk-react-ui";

import { styled } from "styled-components";
import { plinkoABI, plinkoAddress } from "../contracts/Plinko";

export default function Root() {
  const [account, setAccount] = React.useState(null);
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  useEffect(() => {
    const connect = async () => {
      try {
        const accounts = await sdk?.connect();
        setAccount(accounts?.[0]);
        console.log(accounts);
      } catch (err) {
        console.warn(`failed to connect..`, err);
      }
    };

    connect();
  });

  return (
    <div className="bg-black w-screen h-screen">
      <div className="w-full h-[50px] bg-[#1a1a1a] flex items-center justify-evenly px-[30%] bg-opacity-50 text-xs text-white fixed">
        <Link
          to={""}
          className="hover:no-underline text-[#f0f0f0] hover:text-white transition-colors duration-100"
        >
          Home Page
        </Link>
        <Link
          to={"plinko"}
          className="hover:no-underline text-[#f0f0f0] hover:text-white transition-colors duration-100"
        >
          Plinko
        </Link>
        <div className="text-lighter">Coin Flip</div>
        <Link
          to={"staker"}
          className="hover:no-underline text-[#f0f0f0] hover:text-white transition-colors duration-100"
        >
          Become A Staker!
        </Link>
      </div>
      <div className="pt-[50px] flex w-screen h-screen">
        <Outlet />
      </div>
    </div>
  );
}
