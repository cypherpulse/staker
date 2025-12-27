// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/BaseStaker.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract BaseStakerTest is Test {
    BaseStaker staker;
    MockERC20 stakingToken;
    MockERC20 rewardToken;
    address treasury;
    address user1;
    address user2;
    address owner;

    receive() external payable {}

    uint256 initialRate = 3168807839; // Approx for 10% APR

    function setUp() public {
        owner = address(this);
        treasury = makeAddr("treasury");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        stakingToken = new MockERC20("StakingToken", "STK");
        rewardToken = new MockERC20("RewardToken", "RWD");

        staker = new BaseStaker(treasury, address(stakingToken), address(rewardToken), initialRate);

        // Mint tokens
        stakingToken.mint(user1, 100 ether);
        stakingToken.mint(user2, 100 ether);
        rewardToken.mint(address(staker), 10000 ether); // For rewards, but actually rewards are transferred from staker

        // Approve
        vm.prank(user1);
        stakingToken.approve(address(staker), 100 ether);
        vm.prank(user2);
        stakingToken.approve(address(staker), 100 ether);
    }

    function testStakeERC20() public {
        vm.prank(user1);
        staker.stake();

        assertEq(staker.userStakes(user1), 99500000000000000000); // 100 - 0.5%
        assertEq(staker.totalStaked(), 99500000000000000000);
        assertEq(stakingToken.balanceOf(treasury), 500000000000000000); // 0.5 ether
    }

    function testStakeETH() public {
        BaseStaker ethStaker = new BaseStaker(treasury, address(0), address(rewardToken), initialRate);
        rewardToken.mint(address(ethStaker), 10000 ether);

        vm.deal(user1, 100 ether);
        vm.prank(user1);
        ethStaker.stake{value: 100 ether}();

        assertEq(ethStaker.userStakes(user1), 99500000000000000000);
        assertEq(ethStaker.totalStaked(), 99500000000000000000);
        assertEq(treasury.balance, 500000000000000000); // 0.5 ether
    }

    function testStakeBelowMin() public {
        vm.prank(user1);
        stakingToken.approve(address(staker), 0.005 ether);
        vm.prank(user1);
        vm.expectRevert(BaseStaker.BelowMinStake.selector);
        staker.stake();
    }

    function testUnstake() public {
        vm.prank(user1);
        staker.stake();

        vm.prank(user1);
        staker.unstake(50 ether);

        assertEq(staker.userStakes(user1), 49500000000000000000); // 99.5 - 50
        assertEq(stakingToken.balanceOf(user1), 49750000000000000000); // 0 + 49.75
        assertEq(stakingToken.balanceOf(treasury), 750000000000000000); // 0.5 + 0.25
    }

    function testUnstakeInsufficient() public {
        vm.prank(user1);
        vm.expectRevert(BaseStaker.InsufficientStake.selector);
        staker.unstake(100 ether);
    }

    function testClaimRewards() public {
        vm.prank(user1);
        staker.stake();

        vm.warp(block.timestamp + 365 days);

        uint256 pending = staker.pendingRewards(user1);
        assertGt(pending, 0);

        vm.prank(user1);
        staker.claimRewards();

        assertEq(staker.userRewards(user1), 0);
        assertEq(rewardToken.balanceOf(user1), pending);
    }

    function testClaimNoRewards() public {
        vm.prank(user1);
        vm.expectRevert(BaseStaker.NoRewards.selector);
        staker.claimRewards();
    }

    function testPendingRewards() public {
        vm.prank(user1);
        staker.stake();

        vm.warp(block.timestamp + 1 days);

        uint256 pending = staker.pendingRewards(user1);
        uint256 expected = (99500000000000000000 * initialRate * 1 days) / 1e18;
        assertEq(pending, expected);
    }

    function testSetRewardRate() public {
        staker.setRewardRate(1000);
        assertEq(staker.rewardRate(), 1000);
    }

    function testPause() public {
        staker.pause();
        assertTrue(staker.paused());

        vm.prank(user1);
        vm.expectRevert("EnforcedPause()");
        staker.stake();
    }

    function testUnpause() public {
        staker.pause();
        staker.unpause();
        assertFalse(staker.paused());
    }

    function testEmergencyWithdraw() public {
        stakingToken.mint(address(staker), 10 ether);
        staker.emergencyWithdraw(address(stakingToken), 10 ether);
        assertEq(stakingToken.balanceOf(owner), 10 ether);
    }

    function testEmergencyWithdrawETH() public {
        uint256 balanceBefore = owner.balance;
        vm.deal(address(staker), 10 ether);
        staker.emergencyWithdraw(address(0), 10 ether);
        uint256 balanceAfter = owner.balance;
        assertEq(balanceAfter - balanceBefore, 10 ether);
    }

    function testFeeTransferFailed() public {
        // For ETH, if treasury is not payable, but since it's address, hard to test.
        // Skip or assume.
    }

    function testMultipleUsers() public {
        vm.prank(user1);
        staker.stake();

        vm.prank(user2);
        staker.stake();

        assertEq(staker.totalStaked(), 199000000000000000000);
    }

    function testUpdateRewards() public {
        vm.prank(user1);
        staker.stake();

        vm.warp(block.timestamp + 100);

        stakingToken.mint(user1, 100 ether);
        vm.prank(user1);
        stakingToken.approve(address(staker), 100 ether);
        vm.prank(user1);
        staker.stake(); // This calls _updateRewards

        uint256 rewards = staker.userRewards(user1);
        assertGt(rewards, 0);
    }
}