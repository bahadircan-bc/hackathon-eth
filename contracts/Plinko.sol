// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Plinko {

    struct Bet {
        address player;
        uint256 wager;
        uint256 multipleBets;
        uint8 rows;
        uint8 risk;
    }

    constructor(){

    }
}
