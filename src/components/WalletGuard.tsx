import React from 'react';
import { Wallet, AlertTriangle } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const WalletGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected, isRightNetwork, isConnecting, connectWallet, switchToRitual } = useWallet();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 pt-16">
        <div className="bg-card rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-brand-purple/20 flex items-center justify-center mx-auto mb-5">
            <Wallet size={32} className="text-brand-purple" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Connect your wallet to access Nexora</h2>
          <p className="text-sm text-text-secondary mb-6">You need a connected wallet to use this feature.</p>
          <button onClick={connectWallet} disabled={isConnecting} className="px-6 py-3 bg-brand-purple hover:bg-brand-purple/80 text-white rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2 mx-auto">
            <Wallet size={18} /> {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    );
  }

  if (!isRightNetwork) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 pt-16">
        <div className="bg-card rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={32} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Wrong Network</h2>
          <p className="text-sm text-text-secondary mb-6">Please switch to Ritual Network to continue.</p>
          <button onClick={switchToRitual} className="px-6 py-3 bg-brand-purple hover:bg-brand-purple/80 text-white rounded-lg font-semibold transition-all hover:scale-105">
            Switch to Ritual
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default WalletGuard;
