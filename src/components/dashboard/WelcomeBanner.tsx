import React from 'react';
import { useWallet } from '../../context/WalletContext';

const WelcomeBanner: React.FC = () => {
  const { walletAddress } = useWallet();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-brand-purple/10 p-6 lg:p-8">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/5 to-transparent" />

      <div className="relative z-10">
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
          Welcome back, {walletAddress}
        </h1>
        <p className="text-lg text-text-secondary">
          Keep your streak alive. New challenges await.
        </p>
      </div>
    </div>
  );
};

export default WelcomeBanner;
