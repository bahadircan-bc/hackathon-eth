// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

    struct Bet {
        address player;
        uint256 wager;
        uint256 multipleBets;
        uint8 rows;
        uint8 risk;
    }

contract Plinko is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    IERC20 public token;

    mapping(uint8 => mapping(uint8 => uint256[])) public plinkoMultipliers;
    mapping(uint256 => Bet) private games;

    constructor(IERC20 _token){
        token = _token;
    }

    function getMultipliers(uint8 risk, uint8 numRows)
    external
    view
    returns (uint256[] memory multipliers)
    {
        return plinkoMultipliers[risk][numRows];
    }
    function setMultipliers(uint8 risk, uint8 numRows, uint256[] memory multipliers) external onlyOwner {
        plinkoMultipliers[risk][numRows] = multipliers;
    }

    function getPseudoRandomness() private view returns(uint256) {
        uint256 randomValue = 29111923; //We have encountered problems when using vrf coordinator on testnet, so we use a pseudo random number for now

        return uint256(
            keccak256(
                abi.encodePacked(
                    randomValue,
                    block.timestamp,
                    blockhash(block.number - 1),
                    blockhash(block.number)
                )
            )
        );
    }
}
