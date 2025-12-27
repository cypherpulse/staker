import { Info, User, Building, AlertCircle, Coins, Percent, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useContractData, useTokenInfo } from '../hooks/useContractData';
import { BASESTAKER_ADDRESS, ZERO_ADDRESS } from '../config/contract';

export function InfoSection() {
  const {
    owner,
    treasury,
    paused,
    minStake,
    protocolFeeBps,
    stakingToken,
    rewardToken,
    isEthStaking,
  } = useContractData();

  const { symbol: stakingSymbol } = useTokenInfo(stakingToken);
  const { symbol: rewardSymbol } = useTokenInfo(rewardToken);

  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const AddressDisplay = ({ address, label }: { address: string; label: string }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
      <div>
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="font-mono text-sm">{shortenAddress(address)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => copyToClipboard(address)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          title="Copy address"
        >
          {copiedAddress === address ? (
            <Check className="w-4 h-4 text-success" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        <a
          href={`https://sepolia.basescan.org/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          title="View on BaseScan"
        >
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </a>
      </div>
    </div>
  );

  const infoItems = [
    {
      icon: User,
      label: 'Owner',
      value: owner ? shortenAddress(owner) : 'Loading...',
      address: owner,
    },
    {
      icon: Building,
      label: 'Treasury',
      value: treasury ? shortenAddress(treasury) : 'Loading...',
      address: treasury,
    },
    {
      icon: AlertCircle,
      label: 'Status',
      value: paused ? 'Paused' : 'Active',
      status: paused ? 'destructive' : 'success',
    },
    {
      icon: Coins,
      label: 'Min Stake',
      value: `${minStake} ${isEthStaking ? 'ETH' : stakingSymbol}`,
    },
    {
      icon: Percent,
      label: 'Protocol Fee',
      value: `${protocolFeeBps / 100}%`,
    },
  ];

  return (
    <section id="info" className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-header justify-center text-2xl mb-8">
            <Info className="w-6 h-6 text-primary" />
            Contract Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contract Address */}
            <div className="glass-card p-6 md:col-span-2">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Contract Address
              </h3>
              <AddressDisplay address={BASESTAKER_ADDRESS} label="BaseStaker" />
            </div>

            {/* Info Grid */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Protocol Details</h3>
              <div className="space-y-4">
                {infoItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                    <span 
                      className={`text-sm font-medium font-mono ${
                        item.status === 'destructive' ? 'text-destructive' : 
                        item.status === 'success' ? 'text-success' : 
                        ''
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Token Addresses */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Token Addresses</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">Staking Token</p>
                  {stakingToken === ZERO_ADDRESS ? (
                    <p className="font-mono text-sm text-primary">Native ETH</p>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-sm">{stakingToken ? shortenAddress(stakingToken) : '...'}</p>
                      <span className="text-xs text-muted-foreground">{stakingSymbol}</span>
                    </div>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">Reward Token</p>
                  {rewardToken === ZERO_ADDRESS ? (
                    <p className="font-mono text-sm text-primary">Native ETH</p>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-sm">{rewardToken ? shortenAddress(rewardToken) : '...'}</p>
                      <span className="text-xs text-muted-foreground">{rewardSymbol}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Key Addresses */}
            <div className="glass-card p-6 md:col-span-2">
              <h3 className="font-semibold mb-4">Key Addresses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {owner && <AddressDisplay address={owner} label="Owner" />}
                {treasury && <AddressDisplay address={treasury} label="Treasury" />}
              </div>
            </div>
          </div>

          {/* Network Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Deployed on Base Sepolia (Chain ID: 84532) • 
              <a 
                href={`https://sepolia.basescan.org/address/${BASESTAKER_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                View on BaseScan ↗
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
