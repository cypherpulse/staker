import { Coins, TrendingUp, Gift, Percent } from 'lucide-react';
import { useContractData, useTokenInfo } from '../hooks/useContractData';

export function StatsHero() {
  const { 
    totalStaked, 
    userStake, 
    pendingRewards, 
    userRewards, 
    rewardRate,
    isConnected,
    stakingToken,
    isEthStaking 
  } = useContractData();

  const { symbol } = useTokenInfo(stakingToken);
  const tokenSymbol = isEthStaking ? 'ETH' : symbol;

  const stats = [
    {
      label: 'Total Staked',
      value: `${Number(totalStaked).toLocaleString(undefined, { maximumFractionDigits: 4 })}`,
      suffix: tokenSymbol,
      icon: Coins,
      color: 'from-primary to-primary/50',
    },
    {
      label: 'Your Stake',
      value: isConnected ? `${Number(userStake).toLocaleString(undefined, { maximumFractionDigits: 4 })}` : '—',
      suffix: isConnected ? tokenSymbol : '',
      icon: TrendingUp,
      color: 'from-accent to-accent/50',
    },
    {
      label: 'Pending Rewards',
      value: isConnected ? `${Number(pendingRewards).toLocaleString(undefined, { maximumFractionDigits: 6 })}` : '—',
      suffix: isConnected ? tokenSymbol : '',
      icon: Gift,
      color: 'from-success to-success/50',
    },
    {
      label: 'Reward Rate',
      value: `${Number(rewardRate).toLocaleString(undefined, { maximumFractionDigits: 6 })}`,
      suffix: `${tokenSymbol}/sec`,
      icon: Percent,
      color: 'from-warning to-warning/50',
    },
  ];

  return (
    <section className="relative py-12">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Hero Title */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">
            <span className="text-primary">Stake & Earn</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto px-4">
            Stake your {tokenSymbol} and earn rewards. Simple, secure, and transparent.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="stat-card animate-fade-in p-4 md:p-6"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
                </div>
              </div>
              <p className="label-text text-xs md:text-sm">{stat.label}</p>
              <div className="flex items-baseline gap-1 md:gap-2">
                <p className="value-text text-xl md:text-2xl truncate">{stat.value}</p>
                {stat.suffix && (
                  <span className="text-xs md:text-sm text-muted-foreground">{stat.suffix}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Accrued rewards card - only for connected users with rewards */}
        {isConnected && Number(userRewards) > 0 && (
          <div className="mt-6 stat-card text-center animate-fade-in">
            <p className="label-text">Accrued (Unclaimed) Rewards</p>
            <p className="value-text text-success">
              {Number(userRewards).toLocaleString(undefined, { maximumFractionDigits: 6 })} {tokenSymbol}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
