import { useState, useEffect } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Gift, AlertTriangle, Loader2 } from 'lucide-react';
import { useContractData, useTokenInfo } from '../hooks/useContractData';
import { useStake, useUnstake, useClaimRewards } from '../hooks/useContractActions';
import { parseEther } from 'viem';

export function StakingSection() {
  const {
    isConnected,
    userStake,
    userStakeRaw,
    pendingRewards,
    pendingRewardsRaw,
    userRewards,
    userRewardsRaw,
    ethBalance,
    minStake,
    minStakeRaw,
    protocolFeeBps,
    paused,
    stakingToken,
    isEthStaking,
    refetchUserData,
  } = useContractData();

  const { symbol } = useTokenInfo(stakingToken);
  const tokenSymbol = isEthStaking ? 'ETH' : symbol;

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  const { stake, isPending: isStaking, isSuccess: stakeSuccess } = useStake();
  const { unstake, isPending: isUnstaking, isSuccess: unstakeSuccess } = useUnstake();
  const { claimRewards, isPending: isClaiming, isSuccess: claimSuccess } = useClaimRewards();

  // Refetch data on successful transactions
  useEffect(() => {
    if (stakeSuccess || unstakeSuccess || claimSuccess) {
      refetchUserData();
      setStakeAmount('');
      setUnstakeAmount('');
    }
  }, [stakeSuccess, unstakeSuccess, claimSuccess, refetchUserData]);

  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    stake(stakeAmount);
  };

  const handleUnstake = () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) return;
    unstake(unstakeAmount);
  };

  const handleClaim = () => {
    claimRewards();
  };

  const handleMaxStake = () => {
    // Leave some ETH for gas
    const maxStake = Math.max(0, parseFloat(ethBalance) - 0.01);
    setStakeAmount(maxStake.toString());
  };

  const handleMaxUnstake = () => {
    setUnstakeAmount(userStake);
  };

  // Calculate fee
  const feePercent = protocolFeeBps / 100;
  const stakeFee = stakeAmount ? (parseFloat(stakeAmount) * protocolFeeBps / 10000).toFixed(6) : '0';
  const unstakeFee = unstakeAmount ? (parseFloat(unstakeAmount) * protocolFeeBps / 10000).toFixed(6) : '0';

  // Validation
  let stakeAmountBigInt = BigInt(0);
  try {
    stakeAmountBigInt = stakeAmount ? parseEther(stakeAmount) : BigInt(0);
  } catch {
    // Invalid input
  }
  const isStakeValid = stakeAmount && parseFloat(stakeAmount) > 0 && 
    (!minStakeRaw || stakeAmountBigInt >= minStakeRaw);
  
  let unstakeAmountBigInt = BigInt(0);
  try {
    unstakeAmountBigInt = unstakeAmount ? parseEther(unstakeAmount) : BigInt(0);
  } catch {
    // Invalid input
  }
  const isUnstakeValid = unstakeAmount && parseFloat(unstakeAmount) > 0 && 
    userStakeRaw && unstakeAmountBigInt <= userStakeRaw;

  const totalRewards = (pendingRewardsRaw ?? BigInt(0)) + (userRewardsRaw ?? BigInt(0));
  const hasRewards = totalRewards > BigInt(0);

  if (!isConnected) {
    return (
      <section id="stake" className="py-12">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ArrowDownToLine className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground">
              Connect your wallet to start staking and earning rewards.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="stake" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="section-header justify-center text-2xl mb-8">
          <ArrowDownToLine className="w-6 h-6 text-primary" />
          Staking Panel
        </h2>

        {/* Paused Warning */}
        {paused && (
          <div className="glass-card border-warning/50 p-4 mb-6 flex items-center gap-3 max-w-2xl mx-auto">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
            <p className="text-sm text-warning">
              Contract is currently paused. Staking and unstaking are disabled.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Stake Card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ArrowDownToLine className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Stake {tokenSymbol}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="label-text">Amount</label>
                  <button 
                    onClick={handleMaxStake}
                    className="text-xs text-primary hover:underline"
                  >
                    Balance: {Number(ethBalance).toFixed(4)} {tokenSymbol}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.0"
                    className="input-field w-full pr-16"
                    disabled={paused}
                  />
                  <button
                    onClick={handleMaxStake}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-primary hover:text-primary/80"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {stakeAmount && parseFloat(stakeAmount) > 0 && (
                <div className="p-3 rounded-lg bg-secondary/50 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee ({feePercent}%):</span>
                    <span className="text-warning">{stakeFee} {tokenSymbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">You receive:</span>
                    <span>{(parseFloat(stakeAmount) - parseFloat(stakeFee)).toFixed(6)} {tokenSymbol}</span>
                  </div>
                </div>
              )}

              {minStake && parseFloat(minStake) > 0 && (
                <p className="text-xs text-muted-foreground">
                  Min stake: {minStake} {tokenSymbol}
                </p>
              )}

              <button
                onClick={handleStake}
                disabled={paused || !isStakeValid || isStaking}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isStaking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Staking...
                  </>
                ) : (
                  <>
                    <ArrowDownToLine className="w-4 h-4" />
                    Stake
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Unstake Card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <ArrowUpFromLine className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold">Unstake {tokenSymbol}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="label-text">Amount</label>
                  <button 
                    onClick={handleMaxUnstake}
                    className="text-xs text-primary hover:underline"
                  >
                    Staked: {Number(userStake).toFixed(4)} {tokenSymbol}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    placeholder="0.0"
                    className="input-field w-full pr-16"
                    disabled={paused}
                  />
                  <button
                    onClick={handleMaxUnstake}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-primary hover:text-primary/80"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {unstakeAmount && parseFloat(unstakeAmount) > 0 && (
                <div className="p-3 rounded-lg bg-secondary/50 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee ({feePercent}%):</span>
                    <span className="text-warning">{unstakeFee} {tokenSymbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">You receive:</span>
                    <span>{(parseFloat(unstakeAmount) - parseFloat(unstakeFee)).toFixed(6)} {tokenSymbol}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleUnstake}
                disabled={paused || !isUnstakeValid || isUnstaking}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                {isUnstaking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Unstaking...
                  </>
                ) : (
                  <>
                    <ArrowUpFromLine className="w-4 h-4" />
                    Unstake
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Claim Rewards Card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Gift className="w-5 h-5 text-success" />
              </div>
              <h3 className="font-semibold">Claim Rewards</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="label-text mb-1">Pending Rewards</p>
                <p className="text-2xl font-bold font-mono">
                  {Number(pendingRewards).toFixed(6)}
                  <span className="text-sm text-muted-foreground ml-2">{tokenSymbol}</span>
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="label-text mb-1">Accrued Rewards</p>
                <p className="text-2xl font-bold font-mono">
                  {Number(userRewards).toFixed(6)}
                  <span className="text-sm text-muted-foreground ml-2">{tokenSymbol}</span>
                </p>
              </div>

              <button
                onClick={handleClaim}
                disabled={!hasRewards || isClaiming}
                className="btn-primary w-full flex items-center justify-center gap-2"
                style={{ 
                  background: hasRewards 
                    ? 'linear-gradient(135deg, hsl(142 76% 36%), hsl(142 76% 46%))' 
                    : undefined 
                }}
              >
                {isClaiming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Claiming...
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    Claim All Rewards
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Fee Warning */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            ⚠️ A {feePercent}% protocol fee is applied to all stake and unstake transactions
          </p>
        </div>
      </div>
    </section>
  );
}
