#!/bin/bash

# Load environment variables
source .env

# Deploy BaseStaker to Base Sepolia testnet
forge script script/DeployBaseStaker.s.sol \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --account defaultKey \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY