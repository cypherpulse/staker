import { useState } from 'react';
import { Activity, ArrowDownToLine, ArrowUpFromLine, Gift, Pause, Play } from 'lucide-react';

interface ContractEvent {
  id: string;
  type: 'Staked' | 'Unstaked' | 'RewardsClaimed' | 'Paused' | 'Unpaused';
  user?: string;
  amount?: string;
  timestamp: Date;
}

export function EventsLog() {
  const [events] = useState<ContractEvent[]>([]);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Staked':
        return <ArrowDownToLine className="w-4 h-4 text-primary" />;
      case 'Unstaked':
        return <ArrowUpFromLine className="w-4 h-4 text-accent" />;
      case 'RewardsClaimed':
        return <Gift className="w-4 h-4 text-success" />;
      case 'Paused':
        return <Pause className="w-4 h-4 text-destructive" />;
      case 'Unpaused':
        return <Play className="w-4 h-4 text-success" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'Staked':
        return 'border-l-primary';
      case 'Unstaked':
        return 'border-l-accent';
      case 'RewardsClaimed':
        return 'border-l-success';
      case 'Paused':
        return 'border-l-destructive';
      case 'Unpaused':
        return 'border-l-success';
      default:
        return 'border-l-muted';
    }
  };

  if (events.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="section-header justify-center text-2xl mb-8">
              <Activity className="w-6 h-6 text-primary" />
              Recent Activity
            </h2>
            <div className="glass-card p-8 text-center">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                No recent events. Activity will appear here when transactions occur.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="section-header justify-center text-2xl mb-8">
            <Activity className="w-6 h-6 text-primary" />
            Recent Activity
          </h2>

          <div className="glass-card p-4 space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className={`flex items-center gap-4 p-3 rounded-lg bg-secondary/30 border-l-2 ${getEventColor(event.type)} animate-slide-in-right`}
              >
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{event.type}</span>
                    {event.amount && (
                      <span className="text-sm text-muted-foreground">
                        {Number(event.amount).toFixed(4)} ETH
                      </span>
                    )}
                  </div>
                  {event.user && (
                    <p className="text-xs text-muted-foreground font-mono truncate">
                      {shortenAddress(event.user)}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {event.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
