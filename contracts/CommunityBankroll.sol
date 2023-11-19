// SPDX-License-Identifier: GPL-3.0
/// @author Candas Sonuzun
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Bankroll is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    IERC20 public stakingToken;
    uint256 public totalStaked;
    int256 public totalEarnings;
    uint256 constant MINIMUM_STAKE_TIME = 1 days;  // 1 day in seconds
    mapping(address => Staker) public stakers;

    event Staked(address indexed user, uint256 amount, uint256 time);
    event Unstaked(address indexed user, uint256 amount, uint256 time);
    modifier onlyGame() {
        require(isGame[msg.sender], "Caller is not an authorized game");
        _;
    }
    receive() external payable {}

    struct Staker {
        uint256 stakedAmount;
        int256 stakerInitialEarnings;
        uint256 stakeTime;
    }

    // Stores whether a game contract is allowed to access the bankroll
    mapping(address => bool) public isGame;

    // Stores whether a token is allowed to be wagered
    mapping(address => bool) public isTokenAllowed;

    // Event emitted when game state is changed
    event GameStateChanged(address game, bool isActive);

    // Event emitted when token state is changed
    event TokenStateChanged(address token, bool isAllowed);

    // Event emitted when a user harvests tokens
    event Harvested(address indexed user, uint256 amount);
    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
    }

    function setGame(address game, bool isActive) external onlyOwner {
        isGame[game] = isActive;
        emit GameStateChanged(game, isActive);
    }

    function setToken(address token, bool isAllowed) external onlyOwner {
        isTokenAllowed[token] = isAllowed;
        emit TokenStateChanged(token, isAllowed);
    }

    function isToken(address token) external view returns (bool) {
        return isTokenAllowed[token];
    }

    function stake(uint256 _amount) external {
        _updatePoolEarnings();

        require(_amount > 0, "Amount should be greater than 0");

        stakingToken.transferFrom(msg.sender, address(this), _amount);

        stakers[msg.sender].stakerInitialEarnings = totalEarnings;
        stakers[msg.sender].stakedAmount = stakers[msg.sender].stakedAmount.add(_amount);
        stakers[msg.sender].stakeTime = block.timestamp;
        totalStaked = totalStaked.add(_amount);

        emit Staked(msg.sender, _amount, block.timestamp);
    }

    function unstake(uint256 _amount) external {
        _updatePoolEarnings();

        require(_amount > 0, "Amount should be greater than 0");
        require(stakers[msg.sender].stakedAmount >= _amount, "Insufficient staked amount");
        require(block.timestamp >= stakers[msg.sender].stakeTime + MINIMUM_STAKE_TIME, "Stake must be held for at least 1 day");

        stakers[msg.sender].stakedAmount = stakers[msg.sender].stakedAmount.sub(_amount);
        totalStaked = totalStaked.sub(_amount);

        uint256 withdrawalAmount = calculateWithdrawalAmount(msg.sender, _amount);
        stakingToken.transfer(msg.sender, withdrawalAmount);

        emit Unstaked(msg.sender, _amount, block.timestamp);
    }

    function getHarvestableAmount(address _staker) public view returns (uint256) {
        Staker memory staker = stakers[_staker];
        if (staker.stakedAmount == 0) {
            return 0;
        }

        int256 stakerEarnings = (currentEarnings() - staker.stakerInitialEarnings) * int256(staker.stakedAmount) / int256(totalStaked);
        if (stakerEarnings <= 0) {
            return 0;
        }

        return uint256(stakerEarnings);
    }

    function harvest() external {
        _updatePoolEarnings();

        Staker storage staker = stakers[msg.sender];
        require(staker.stakedAmount > 0, "No staked amount");

        int256 stakerEarnings = (totalEarnings - staker.stakerInitialEarnings) * int256(staker.stakedAmount) / int256(totalStaked);

        require(stakerEarnings > 0, "No earnings to harvest");

        staker.stakerInitialEarnings = totalEarnings;

        uint256 harvestAmount = uint256(stakerEarnings);
        stakingToken.safeTransfer(msg.sender, harvestAmount);

        emit Harvested(msg.sender, harvestAmount);
    }


    function _updatePoolEarnings() internal {
        int256 currentBalance = int256(stakingToken.balanceOf(address(this)));
        int256 currentEarnings = currentBalance - int256(totalStaked);
        totalEarnings += currentEarnings;
    }

    // External function that can be called by other contracts
    function updatePoolEarningsExternal() external onlyGame {
        require(isGame[msg.sender], "Only games can update pool earnings");
        _updatePoolEarnings();
    }

    function currentEarnings() public view returns (int256) {
        int256 currentBalance = int256(stakingToken.balanceOf(address(this)));
        int256 currentEarnings = currentBalance - int256(totalStaked);
        return totalEarnings + currentEarnings;
    }

    function calculateWithdrawalAmount(address _staker, uint256 _amount) public view returns (uint256) {
        int256 stakerEarnings = (totalEarnings - stakers[_staker].stakerInitialEarnings) * int256(stakers[_staker].stakedAmount) / int256(totalStaked);
        int256 withdrawalAmount = int256(_amount) + stakerEarnings;

        if (withdrawalAmount < int256(_amount)) {
            return _amount;
        }
        return uint256(withdrawalAmount);
    }

    function transferTokenPayout(
        address tokenAddress,
        address player,
        uint256 payout
    ) external {
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        require(balance >= payout, "Not enough balance.");
        token.safeTransfer(player, payout);
        _updatePoolEarnings();
    }
}
