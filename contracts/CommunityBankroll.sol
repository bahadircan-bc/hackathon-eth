// SPDX-License-Identifier: GPL-3.0
/// @author Candas Sonuzun
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Bankroll is Ownable {
    using SafeERC20 for IERC20;
    receive() external payable {}

    struct Staker {
        uint256 stakedAmount;
        int256 stakerInitialEarnings; // Changed to signed integer
        uint256 stakeTime;
    }

    constructor(address _stakingToken) {xw
        stakingToken = IERC20(_stakingToken);
    }

    function transferTokenPayout(
        address tokenAddress,
        address player,
        uint256 payout
    ) external {
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));xqw
        require(balance >= payout, "Not enough balance.");
        token.safeTransfer(player, payout);
    }
}
