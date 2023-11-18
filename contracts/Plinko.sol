// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IBankroll {
    function transferTokenPayout(
        address tokenAddress,
        address player,
        uint256 payout
    ) external;
}

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
    IBankroll public bankroll;

    error WagerAboveLimit(uint256 wager, uint256 maxWager);

    mapping(uint8 => mapping(uint8 => uint256[])) public plinkoMultipliers;
    mapping(address => Bet) private games;

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

    function setBankroll(address _bankroll) external onlyOwner {
        bankroll = IBankroll(_bankroll);
    }
    function getBankroll() external view returns (address) {
        return address(bankroll);
    }

    function getPseudoRandomness() private view returns (uint256) {
        uint256 randomValue = 29111923;
        //We have encountered problems when using vrf coordinator on testnet, so we use a pseudo random number for now

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

    function play(
        uint256 wager,
        uint8 risk,
        uint8 numRows,
        uint256 multipleBets
    ) external payable nonReentrant {
        address player = msg.sender;
        uint256 totalWager = wager * multipleBets;
        _kellyWager(totalWager, address(token));
        token.safeTransferFrom(player, address(bankroll), totalWager);
        games[player] = Bet(player, wager, multipleBets, numRows, risk);
    }

    function _kellyWager(uint256 bet, address tokenAddress) internal view {
        uint256 balance;
        ///@dev check if the token is native or not
        if (tokenAddress == address(0)) {
            balance = address(bankroll).balance;
        } else {
            balance = token.balanceOf(address(bankroll));
        }
        uint256 maxBet = (balance * 1100000) / 100000000;
        if (bet > maxBet) {
            revert WagerAboveLimit(bet, maxBet);
        }
    }
}
