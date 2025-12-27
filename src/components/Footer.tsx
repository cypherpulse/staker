import { Zap, Github, ExternalLink } from 'lucide-react';
import { BASESTAKER_ADDRESS } from '../config/contract';

export function Footer() {
  return (
    <footer className="py-12 border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Stake & Earn</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a
              href={`https://sepolia.basescan.org/address/${BASESTAKER_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Contract
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            Built on Base Sepolia
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-border/20 text-center">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            ⚠️ This is a testnet application. Do not send real funds. 
            Every stake and unstake generates a 0.5% protocol fee that goes to the treasury.
          </p>
        </div>
      </div>
    </footer>
  );
}
