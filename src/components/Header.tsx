import { ConnectKitButton } from 'connectkit';
import { Zap, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">Stake & Earn</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Base Sepolia</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#stake" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Stake
            </a>
            <a href="#info" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Info
            </a>
            <a 
              href="https://sepolia.basescan.org/address/0xfeEfd505E894eA194Aa6Cf6c0226d9Dce9F41323" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contract ↗
            </a>
          </nav>

          {/* Connect Button */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ConnectKitButton.Custom>
              {({ isConnected, show, truncatedAddress, ensName }) => (
                <button
                  onClick={show}
                  className={`${
                    isConnected ? 'btn-secondary' : 'btn-primary'
                  } text-xs sm:text-sm px-3 sm:px-4 py-2`}
                >
                  {isConnected ? ensName ?? truncatedAddress : 'Connect Wallet'}
                </button>
              )}
            </ConnectKitButton.Custom>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pt-3 pb-2 border-t border-border/30 mt-3 sm:mt-4 flex flex-col gap-2 sm:gap-3">
            <a 
              href="#stake" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Stake
            </a>
            <a 
              href="#info" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Info
            </a>
            <a 
              href="https://sepolia.basescan.org/address/0xfeEfd505E894eA194Aa6Cf6c0226d9Dce9F41323" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Contract ↗
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
