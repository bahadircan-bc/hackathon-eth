// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Plinko is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    mapping(uint8 => mapping(uint8 => uint256[])) public plinkoMultipliers;
    mapping(uint256 => Bet) private games;

    constructor(){
        token = _token;
    }

    function getMultipliers(uint8 risk, uint8 numRows)
    external
    view
    returns (uint256[] memory multipliers)
    {
        return plinkoMultipliers[risk][numRows];
    }
}
