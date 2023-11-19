// SPDX-License-Identifier: UNLICENSED
///@author Candaş Sonuzun
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Plinko game contract for blockchain-based betting platform
/// @notice You can use this contract for creating and managing Plinko games
/// @dev This contract uses OpenZeppelin's SafeERC20, ReentrancyGuard, and Ownable
interface IBankroll {
    /// @notice Handles token payouts to players
    /// @param tokenAddress Address of the token
    /// @param player Address of the player to receive the payout
    /// @param payout Amount of the payout
    function transferTokenPayout(address tokenAddress, address player, uint256 payout) external;

    /// @notice Updates the pool's earnings
    function updatePoolEarningsExternal() external;
}

/// @notice Structure to hold information about a bet
    struct Bet {
        address player;
        uint256 wager;
        uint256 multipleBets;
        uint8 rows;
        uint8 risk;
    }

/// @notice Main Plinko game contract
/// @dev Inherits from ReentrancyGuard for non-reentrant methods and Ownable for ownership control
contract Plinko is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public token;
    IBankroll public bankroll;

    error WagerAboveLimit(uint256 wager, uint256 maxWager);

    event Plinko_Play_Event(address indexed playerAddress, uint256 wager, uint256 totalWager, uint8 numRows, uint8 risk);
    event Ball_Landed_Event(address indexed playerAddress, uint256 ballNumber, uint256 landingPosition, uint256 multiplier);
    event Plinko_Payout_Event(address indexed playerAddress, uint256 wager, uint256 payout);

    mapping(uint8 => mapping(uint8 => uint256[])) public plinkoMultipliers;
    mapping(address => Bet) private games;

    /// @notice Constructs the Plinko game contract
    /// @param _token Address of the ERC20 token used for betting
    constructor(IERC20 _token){
        token = _token;
    }

    receive() external payable {}

    /// @notice Returns the multipliers for a given risk and number of rows
    /// @param risk The risk level
    /// @param numRows The number of rows
    /// @return multipliers An array of multiplier values
    function getMultipliers(uint8 risk, uint8 numRows) external view returns (uint256[] memory multipliers) {
        return plinkoMultipliers[risk][numRows];
    }

    /// @notice Sets the multipliers for a given risk and number of rows
    /// @dev This function can only be called by the owner
    /// @param risk The risk level
    /// @param numRows The number of rows
    /// @param multipliers An array of new multiplier values
    function setMultipliers(uint8 risk, uint8 numRows, uint256[] memory multipliers) external onlyOwner {
        plinkoMultipliers[risk][numRows] = multipliers;
    }

    /// @notice Sets the bankroll contract address
    /// @dev This function can only be called by the owner
    /// @param _bankroll Address of the bankroll contract
    function setBankroll(address _bankroll) external onlyOwner {
        bankroll = IBankroll(_bankroll);
    }

    /// @notice Returns the current bankroll contract address
    /// @return The address of the bankroll contract
    function getBankroll() external view returns (address) {
        return address(bankroll);
    }

    /// @notice Generates a pseudo-random number for the game
    /// @dev Currently uses a simple method for generating randomness
    /// @return A pseudo-random number
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

    /// @notice Allows a player to play the Plinko game
    /// @dev This function is non-reentrant to prevent reentrancy attacks
    /// @param wager The wager amount
    /// @param risk The risk level
    /// @param numRows The number of rows
    /// @param multipleBets The number of bets to be placed
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
        Bet memory game = games[player];
        uint256 randomNumber = getPseudoRandomness();
        uint256 payout = calculatePayout(game, randomNumber);
        makePayout(game, payout);
        bankroll.updatePoolEarningsExternal();
    }

    /// @notice Calculates the payout for a game
    /// @param game The bet structure containing game details
    /// @param randomNumber The pseudo-random number used to determine the payout
    /// @return The calculated payout
    function calculatePayout(
        Bet memory game,
        uint256 randomNumber
    ) internal
    returns (uint256) {
        emit Plinko_Play_Event(game.player, game.wager, game.wager * game.multipleBets, game.rows, game.risk);
        uint256 payout = 0;
        uint256 position = 0;
        for (uint256 ballNumber = 0; ballNumber < game.multipleBets; ballNumber++) {
            position = 0;
            for (uint8 i = 0; i < game.rows; i++) {
                if (randomNumber & 1 != 0) {
                    position++;
                }
                randomNumber >>= 1;
            }
            emit Ball_Landed_Event(game.player, ballNumber, position, plinkoMultipliers[game.risk][game.rows][position]);
            //multipliers are multiplied by 100 to avoid floating point numbers
            payout += game.wager * plinkoMultipliers[game.risk][game.rows][position] / 10;
        }

        return payout;
    }

    /// @notice Handles the payout process for a winning bet
    /// @dev Called internally after determining the payout amount
    /// @param game The bet structure containing the details of the bet
    /// @param payout The amount to be paid out to the player
    function makePayout(
        Bet memory game,
        uint256 payout
    ) internal {
        if (payout > 0) {
            bankroll.transferTokenPayout(address(token), game.player, payout);
        }
        emit Plinko_Payout_Event(game.player, game.wager, payout);
    }


    /// @notice Calculates the maximum wager allowed based on the Kelly criterion
    /// @dev Used internally to limit the bet size relative to the bankroll's balance
    /// @param bet The amount of the bet to be placed
    /// @param tokenAddress The address of the token being used for betting
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
