// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract BaseStaker is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public immutable TREASURY;
    address public stakingToken;
    address public rewardToken;
    uint256 public rewardRate;
    uint256 public totalStaked;

    mapping(address => uint256) public userStakes;
    mapping(address => uint256) public userRewards;
    mapping(address => uint256) public lastUpdateTime;

    uint256 public constant PROTOCOL_FEE_BPS = 50; // 0.5%
    uint256 public constant MIN_STAKE = 0.01 ether;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);

    error BelowMinStake();
    error InsufficientStake();
    error NoRewards();
    error FeeTransferFailed();

    constructor(
        address _treasury,
        address _stakingToken,
        address _rewardToken,
        uint256 _initialRate
    ) Ownable(msg.sender) {
        TREASURY = _treasury;
        stakingToken = _stakingToken;
        rewardToken = _rewardToken;
        rewardRate = _initialRate;
    }

    function stake() external payable nonReentrant whenNotPaused {
        uint256 amount = (stakingToken == address(0)) ? msg.value : 0;
        if (stakingToken != address(0)) {
            amount = IERC20(stakingToken).allowance(msg.sender, address(this));
            SafeERC20.safeTransferFrom(IERC20(stakingToken), msg.sender, address(this), amount);
        }
        if (amount < MIN_STAKE) revert BelowMinStake();
        uint256 fee = (amount * PROTOCOL_FEE_BPS) / 10000;
        uint256 amountAfterFee = amount - fee;
        _updateRewards(msg.sender);
        userStakes[msg.sender] += amountAfterFee;
        totalStaked += amountAfterFee;
        if (stakingToken == address(0)) {
            (bool success,) = TREASURY.call{value: fee}("");
            if (!success) revert FeeTransferFailed();
        } else {
            SafeERC20.safeTransfer(IERC20(stakingToken), TREASURY, fee);
        }
        emit Staked(msg.sender, amountAfterFee);
    }

    function unstake(uint256 amount) external nonReentrant whenNotPaused {
        if (userStakes[msg.sender] < amount) revert InsufficientStake();
        _updateRewards(msg.sender);
        uint256 fee = (amount * PROTOCOL_FEE_BPS) / 10000;
        uint256 amountAfterFee = amount - fee;
        userStakes[msg.sender] -= amount;
        totalStaked -= amount;
        if (stakingToken == address(0)) {
            payable(msg.sender).transfer(amountAfterFee);
            (bool success,) = TREASURY.call{value: fee}("");
            if (!success) revert FeeTransferFailed();
        } else {
            SafeERC20.safeTransfer(IERC20(stakingToken), msg.sender, amountAfterFee);
            SafeERC20.safeTransfer(IERC20(stakingToken), TREASURY, fee);
        }
        emit Unstaked(msg.sender, amountAfterFee);
    }

    function claimRewards() external nonReentrant whenNotPaused {
        _updateRewards(msg.sender);
        uint256 rewards = userRewards[msg.sender];
        if (rewards == 0) revert NoRewards();
        userRewards[msg.sender] = 0;
        SafeERC20.safeTransfer(IERC20(rewardToken), msg.sender, rewards);
        emit RewardsClaimed(msg.sender, rewards);
    }

    function _updateRewards(address user) internal {
        uint256 timeDiff = block.timestamp - lastUpdateTime[user];
        uint256 pending = (userStakes[user] * rewardRate * timeDiff) / 1e18;
        userRewards[user] += pending;
        lastUpdateTime[user] = block.timestamp;
    }

    function pendingRewards(address user) external view returns (uint256) {
        uint256 timeDiff = block.timestamp - lastUpdateTime[user];
        return userRewards[user] + (userStakes[user] * rewardRate * timeDiff) / 1e18;
    }

    function setRewardRate(uint256 _rate) external onlyOwner {
        rewardRate = _rate;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            SafeERC20.safeTransfer(IERC20(token), owner(), amount);
        }
    }
}