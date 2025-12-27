import { useState, useEffect } from 'react';
import { Shield, Settings, Pause, Play, AlertTriangle, UserX, Send, Loader2 } from 'lucide-react';
import { useContractData } from '../hooks/useContractData';
import { 
  useSetRewardRate, 
  usePause, 
  useUnpause, 
  useEmergencyWithdraw, 
  useTransferOwnership, 
  useRenounceOwnership 
} from '../hooks/useContractActions';
import { isAddress } from 'viem';

export function AdminSection() {
  const { isOwner, paused, rewardRate, refetchContractData } = useContractData();

  const [newRewardRate, setNewRewardRate] = useState('');
  const [withdrawToken, setWithdrawToken] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [showRenounceConfirm, setShowRenounceConfirm] = useState(false);

  const { setRewardRate, isPending: isSettingRate, isSuccess: rateSuccess } = useSetRewardRate();
  const { pause, isPending: isPausing, isSuccess: pauseSuccess } = usePause();
  const { unpause, isPending: isUnpausing, isSuccess: unpauseSuccess } = useUnpause();
  const { emergencyWithdraw, isPending: isWithdrawing, isSuccess: withdrawSuccess } = useEmergencyWithdraw();
  const { transferOwnership, isPending: isTransferring, isSuccess: transferSuccess } = useTransferOwnership();
  const { renounceOwnership, isPending: isRenouncing, isSuccess: renounceSuccess } = useRenounceOwnership();

  // Refetch on successful actions
  useEffect(() => {
    if (rateSuccess || pauseSuccess || unpauseSuccess || withdrawSuccess || transferSuccess) {
      refetchContractData();
      setNewRewardRate('');
      setWithdrawToken('');
      setWithdrawAmount('');
      setNewOwner('');
    }
  }, [rateSuccess, pauseSuccess, unpauseSuccess, withdrawSuccess, transferSuccess, refetchContractData]);

  if (!isOwner) {
    return null;
  }

  const handleSetRate = () => {
    if (!newRewardRate || parseFloat(newRewardRate) < 0) return;
    setRewardRate(newRewardRate);
  };

  const handleEmergencyWithdraw = () => {
    if (!withdrawToken || !withdrawAmount || !isAddress(withdrawToken)) return;
    emergencyWithdraw(withdrawToken as `0x${string}`, withdrawAmount);
  };

  const handleTransferOwnership = () => {
    if (!newOwner || !isAddress(newOwner)) return;
    transferOwnership(newOwner as `0x${string}`);
  };

  const handleRenounce = () => {
    if (!showRenounceConfirm) {
      setShowRenounceConfirm(true);
      return;
    }
    renounceOwnership();
    setShowRenounceConfirm(false);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-destructive to-destructive/50 flex items-center justify-center">
              <Shield className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Admin Panel</h2>
              <p className="text-sm text-muted-foreground">Contract owner controls</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reward Rate */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Reward Rate</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Current: {rewardRate} tokens/sec
              </p>
              <div className="space-y-3">
                <input
                  type="number"
                  value={newRewardRate}
                  onChange={(e) => setNewRewardRate(e.target.value)}
                  placeholder="New rate (in ether units)"
                  className="input-field w-full"
                />
                <button
                  onClick={handleSetRate}
                  disabled={!newRewardRate || isSettingRate}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {isSettingRate ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Settings className="w-4 h-4" />
                  )}
                  Update Rate
                </button>
              </div>
            </div>

            {/* Pause/Unpause */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                {paused ? (
                  <Play className="w-5 h-5 text-success" />
                ) : (
                  <Pause className="w-5 h-5 text-warning" />
                )}
                <h3 className="font-semibold">Contract Status</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Status: <span className={paused ? 'text-destructive' : 'text-success'}>
                  {paused ? 'Paused' : 'Active'}
                </span>
              </p>
              <div className="space-y-3">
                {paused ? (
                  <button
                    onClick={() => unpause()}
                    disabled={isUnpausing}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, hsl(142 76% 36%), hsl(142 76% 46%))' }}
                  >
                    {isUnpausing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    Unpause Contract
                  </button>
                ) : (
                  <button
                    onClick={() => pause()}
                    disabled={isPausing}
                    className="btn-danger w-full flex items-center justify-center gap-2"
                  >
                    {isPausing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                    Pause Contract
                  </button>
                )}
              </div>
            </div>

            {/* Emergency Withdraw */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h3 className="font-semibold">Emergency Withdraw</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Withdraw tokens in case of emergency
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={withdrawToken}
                  onChange={(e) => setWithdrawToken(e.target.value)}
                  placeholder="Token address (0x...)"
                  className="input-field w-full font-mono text-sm"
                />
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Amount (in ether units)"
                  className="input-field w-full"
                />
                <button
                  onClick={handleEmergencyWithdraw}
                  disabled={!withdrawToken || !withdrawAmount || !isAddress(withdrawToken) || isWithdrawing}
                  className="btn-danger w-full flex items-center justify-center gap-2"
                >
                  {isWithdrawing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  Emergency Withdraw
                </button>
              </div>
            </div>

            {/* Transfer Ownership */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Send className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Transfer Ownership</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Transfer contract ownership to another address
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  placeholder="New owner address (0x...)"
                  className="input-field w-full font-mono text-sm"
                />
                <button
                  onClick={handleTransferOwnership}
                  disabled={!newOwner || !isAddress(newOwner) || isTransferring}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  {isTransferring ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Transfer Ownership
                </button>
              </div>
            </div>

            {/* Renounce Ownership */}
            <div className="md:col-span-2 glass-card p-6 border-destructive/30">
              <div className="flex items-center gap-2 mb-4">
                <UserX className="w-5 h-5 text-destructive" />
                <h3 className="font-semibold text-destructive">Renounce Ownership</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                ⚠️ <strong>Warning:</strong> This action is irreversible! The contract will have no owner 
                and admin functions will be permanently disabled.
              </p>
              <button
                onClick={handleRenounce}
                disabled={isRenouncing}
                className="btn-danger flex items-center justify-center gap-2"
              >
                {isRenouncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserX className="w-4 h-4" />
                )}
                {showRenounceConfirm ? 'Click Again to Confirm' : 'Renounce Ownership'}
              </button>
              {showRenounceConfirm && (
                <button
                  onClick={() => setShowRenounceConfirm(false)}
                  className="ml-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
