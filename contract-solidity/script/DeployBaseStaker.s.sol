// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/BaseStaker.sol";

contract DeployBaseStaker is Script {
    function run() external {
        vm.startBroadcast();

        address treasury = msg.sender; // Deployer as treasury
        address stakingToken = address(0); // ETH
        address rewardToken = 0x1234567890123456789012345678901234567890; // Placeholder for BaseHoney
        uint256 secondsInYear = 365 * 24 * 3600;
        uint256 initialRate = (10 * 1e16) / secondsInYear; // 0.1 * 1e18 / secondsInYear for 10% APR

        BaseStaker staker = new BaseStaker(treasury, stakingToken, rewardToken, initialRate);

        vm.stopBroadcast();

        console.log("BaseStaker deployed at:", address(staker));
    }
}