import { useReadContract, useReadContracts, useAccount, useBalance } from 'wagmi';
import { formatEther } from 'viem';
import { BASESTAKER_ADDRESS, BASESTAKER_ABI, ERC20_ABI, ZERO_ADDRESS } from '../config/contract';

export function useContractData() {
  const { address: userAddress, isConnected } = useAccount();

  // Batch read contract data
  const { data: contractData, refetch: refetchContractData, isLoading } = useReadContracts({
    contracts: [
      {
        address: BASESTAKER_ADDRESS,
        abi: BASESTAKER_ABI,
        functionName: 'totalStaked',
      },
      {
        address: BASESTAKER_ADDRESS,
        abi: BASESTAKER_ABI,
        functionName: 'rewardRate',
      },
      {
        address: BASESTAKER_ADDRESS,
        abi: BASESTAKER_ABI,
        functionName: 'MIN_STAKE',
      },
      {
        address: BASESTAKER_ADDRESS,
        abi: BASESTAKER_ABI,
        functionName: 'PROTOCOL_FEE_BPS',
      },
      {
        address: BASESTAKER_ADDRESS,
        abi: BASESTAKER_ABI,
        functionName: 'TREASURY',
      },
      {
        address: BASESTAKER_ADDRESS,
        abi: BASESTAKER_ABI,
        functionName: 'owner',
      },
      {
        address: BASESTAKER_ADDRESS,
        abi: BASESTAKER_ABI,
        functionName: 'paused',
      },
      {
        address: BASESTAKER_ADDRESS,
        abi: BASESTAKER_ABI,
        functionName: 'stakingToken',
      },
      {
        address: BASESTAKER_ADDRESS,
        abi: BASESTAKER_ABI,
        functionName: 'rewardToken',
      },
    ],
  });

  // User-specific reads
  const { data: userStake, refetch: refetchUserStake } = useReadContract({
    address: BASESTAKER_ADDRESS,
    abi: BASESTAKER_ABI,
    functionName: 'userStakes',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const { data: userRewards, refetch: refetchUserRewards } = useReadContract({
    address: BASESTAKER_ADDRESS,
    abi: BASESTAKER_ABI,
    functionName: 'userRewards',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const { data: pendingRewards, refetch: refetchPendingRewards } = useReadContract({
    address: BASESTAKER_ADDRESS,
    abi: BASESTAKER_ABI,
    functionName: 'pendingRewards',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: userAddress,
  });

  // Extract contract data with proper type casting
  const totalStaked = contractData?.[0]?.result as bigint | undefined;
  const rewardRate = contractData?.[1]?.result as bigint | undefined;
  const minStake = contractData?.[2]?.result as bigint | undefined;
  const protocolFeeBps = contractData?.[3]?.result as bigint | undefined;
  const treasury = contractData?.[4]?.result as `0x${string}` | undefined;
  const owner = contractData?.[5]?.result as `0x${string}` | undefined;
  const paused = contractData?.[6]?.result as boolean | undefined;
  const stakingToken = contractData?.[7]?.result as `0x${string}` | undefined;
  const rewardToken = contractData?.[8]?.result as `0x${string}` | undefined;

  // Check if staking with ETH
  const isEthStaking = stakingToken === ZERO_ADDRESS;

  // Check if user is owner
  const isOwner = userAddress && owner && userAddress.toLowerCase() === owner.toLowerCase();

  // Refetch all user data
  const refetchUserData = () => {
    refetchUserStake();
    refetchUserRewards();
    refetchPendingRewards();
    refetchContractData();
  };

  // Type-safe values
  const userStakeBigInt = userStake as bigint | undefined;
  const userRewardsBigInt = userRewards as bigint | undefined;
  const pendingRewardsBigInt = pendingRewards as bigint | undefined;

  return {
    // Contract state
    totalStaked: totalStaked ? formatEther(totalStaked) : '0',
    totalStakedRaw: totalStaked,
    rewardRate: rewardRate ? formatEther(rewardRate) : '0',
    rewardRateRaw: rewardRate,
    minStake: minStake ? formatEther(minStake) : '0',
    minStakeRaw: minStake,
    protocolFeeBps: protocolFeeBps ? Number(protocolFeeBps) : 0,
    treasury,
    owner,
    paused: paused ?? false,
    stakingToken,
    rewardToken,
    isEthStaking,

    // User state
    userStake: userStakeBigInt ? formatEther(userStakeBigInt) : '0',
    userStakeRaw: userStakeBigInt,
    userRewards: userRewardsBigInt ? formatEther(userRewardsBigInt) : '0',
    userRewardsRaw: userRewardsBigInt,
    pendingRewards: pendingRewardsBigInt ? formatEther(pendingRewardsBigInt) : '0',
    pendingRewardsRaw: pendingRewardsBigInt,
    ethBalance: ethBalance ? formatEther(ethBalance.value) : '0',
    ethBalanceRaw: ethBalance?.value,

    // Meta
    isConnected,
    userAddress,
    isOwner,
    isLoading,
    refetchUserData,
    refetchContractData,
  };
}

export function useTokenInfo(tokenAddress: `0x${string}` | undefined) {
  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: { enabled: !!tokenAddress && tokenAddress !== ZERO_ADDRESS },
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: { enabled: !!tokenAddress && tokenAddress !== ZERO_ADDRESS },
  });

  return {
    symbol: (symbol as string) ?? 'ETH',
    decimals: (decimals as number) ?? 18,
  };
}
