import { Zap, Github, ExternalLink } from 'lucide-react';
import { BASESTAKER_ADDRESS } from '../config/contract';

export function Footer() {
  return (
    <footer className="py-8 sm:py-12 border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-sm sm:text-base">Stake & Earn</span>
          </div>

          {/* Links */}
         <div className="flex items-center gap-4 sm:gap-6 text-sm">
            {/* Contract link with copy button */}
            <div className="flex items-center gap-1">
              <a
                href={`https://sepolia.basescan.org/address/${BASESTAKER_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                Contract
              </a>
              
              {/* COPY BUTTON - ADD THIS RIGHT HERE */}
              <button
                onClick={copyAddress}
                aria-label={copied ? "Address copied" : "Copy contract address to clipboard"}
                className="ml-1 p-1 text-muted-foreground hover:text-foreground transition-colors relative group"
                title="Copy contract address"
                disabled={copied}
              >
                {copied ? (
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                
                {/* Optional tooltip */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {copied ? 'Copied!' : 'Copy address'}
                </div>
              </button>
            </div>

            {/* GitHub link */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-3 h-3 sm:w-4 sm:h-4" />
              GitHub
            </a>
          </div>
          {/* Copyright */}
          <p className="text-xs sm:text-sm text-muted-foreground">
            Built on Base Sepolia
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border/20 text-center">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto px-4">
            ⚠️ This is a testnet application. Do not send real funds. 
            Every stake and unstake generates a 0.5% protocol fee that goes to the treasury.
          </p>
        </div>
      </div>
    </footer>
  );
}
