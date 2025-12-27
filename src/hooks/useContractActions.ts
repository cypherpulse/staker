import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { BASESTAKER_ADDRESS, BASESTAKER_ABI, ERC20_ABI } from '../config/contract';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function useStake() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Stake successful!', {
        description: 'Your ETH has been staked.',
      });
      reset();
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    if (error) {
      toast.error('Stake failed', {
        description: error.message.slice(0, 100),
      });
    }
  }, [error]);

  const stake = (amount: string) => {
    const value = parseEther(amount);
    writeContract({
      address: BASESTAKER_ADDRESS,
      abi: BASESTAKER_ABI,
      functionName: 'stake',
      value,
    } as any);
  };

  return {
    stake,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

export function useUnstake() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Unstake successful!', {
        description: 'Your ETH has been withdrawn.',
      });
      reset();
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    if (error) {
      toast.error('Unstake failed', {
        description: error.message.slice(0, 100),
      });
    }
  }, [error]);

  const unstake = (amount: string) => {
    const value = parseEther(amount);
    writeContract({
      address: BASESTAKER_ADDRESS,
      abi: BASESTAKER_ABI,
      functionName: 'unstake',
      args: [value],
    } as any);
  };

  return {
    unstake,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

export function useClaimRewards() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Rewards claimed!', {
        description: 'Your rewards have been sent to your wallet.',
      });
      reset();
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    if (error) {
      toast.error('Claim failed', {
        description: error.message.slice(0, 100),
      });
    }
  }, [error]);

  const claimRewards = () => {
    writeContract({
      address: BASESTAKER_ADDRESS,
      abi: BASESTAKER_ABI,
      functionName: 'claimRewards',
    } as any);
  };

  return {
    claimRewards,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

export function useSetRewardRate() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Reward rate updated!');
      reset();
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    if (error) {
      toast.error('Update failed', {
        description: error.message.slice(0, 100),
      });
    }
  }, [error]);

  const setRewardRate = (rate: string) => {
    const value = parseEther(rate);
    writeContract({
      address: BASESTAKER_ADDRESS,
      abi: BASESTAKER_ABI,
      functionName: 'setRewardRate',
      args: [value],
    } as any);
  };

  return {
    setRewardRate,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

export function usePause() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Contract paused!');
      reset();
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    if (error) {
      toast.error('Pause failed', {
        description: error.message.slice(0, 100),
      });
    }
  }, [error]);

  const pause = () => {
    writeContract({
      address: BASESTAKER_ADDRESS,
      abi: BASESTAKER_ABI,
      functionName: 'pause',
    } as any);
  };

  return {
    pause,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

export function useUnpause() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Contract unpaused!');
      reset();
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    if (error) {
      toast.error('Unpause failed', {
        description: error.message.slice(0, 100),
      });
    }
  }, [error]);

  const unpause = () => {
    writeContract({
      address: BASESTAKER_ADDRESS,
      abi: BASESTAKER_ABI,
      functionName: 'unpause',
    } as any);
  };

  return {
    unpause,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

export function useEmergencyWithdraw() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Emergency withdrawal complete!');
      reset();
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    if (error) {
      toast.error('Withdrawal failed', {
        description: error.message.slice(0, 100),
      });
    }
  }, [error]);

  const emergencyWithdraw = (tokenAddress: `0x${string}`, amount: string) => {
    const value = parseEther(amount);
    writeContract({
      address: BASESTAKER_ADDRESS,
      abi: BASESTAKER_ABI,
      functionName: 'emergencyWithdraw',
      args: [tokenAddress, value],
    } as any);
  };

  return {
    emergencyWithdraw,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

export function useTransferOwnership() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Ownership transferred!');
      reset();
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    if (error) {
      toast.error('Transfer failed', {
        description: error.message.slice(0, 100),
      });
    }
  }, [error]);

  const transferOwnership = (newOwner: `0x${string}`) => {
    writeContract({
      address: BASESTAKER_ADDRESS,
      abi: BASESTAKER_ABI,
      functionName: 'transferOwnership',
      args: [newOwner],
    } as any);
  };

  return {
    transferOwnership,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

export function useRenounceOwnership() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Ownership renounced!');
      reset();
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    if (error) {
      toast.error('Renounce failed', {
        description: error.message.slice(0, 100),
      });
    }
  }, [error]);

  const renounceOwnership = () => {
    writeContract({
      address: BASESTAKER_ADDRESS,
      abi: BASESTAKER_ABI,
      functionName: 'renounceOwnership',
    } as any);
  };

  return {
    renounceOwnership,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

export function useApproveToken(tokenAddress: `0x${string}` | undefined) {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Token approved!');
      reset();
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    if (error) {
      toast.error('Approval failed', {
        description: error.message.slice(0, 100),
      });
    }
  }, [error]);

  const approve = (amount: string) => {
    if (!tokenAddress) return;
    const value = parseEther(amount);
    writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [BASESTAKER_ADDRESS, value],
    } as any);
  };

  return {
    approve,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}
