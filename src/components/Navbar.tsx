import React, { useState, useEffect } from 'react';
import { Wallet, Zap, AlertTriangle, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useWallet } from '../context/WalletContext';
import { useGame } from '../context/GameContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isConnected, isRightNetwork, isConnecting, shortAddress, connectWallet, disconnectWallet, switchToRitual } = useWallet();
  const { totalXP } = useGame();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = isConnected
    ? [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/challenge', label: 'Challenge' },
        { path: '/leaderboard', label: 'Leaderboard' },
        { path: '/shop', label: 'Shop' },
      ]
    : [
        { path: '/', label: 'Home' },
        { path: '/leaderboard', label: 'Leaderboard' },
        { path: '/shop', label: 'Shop' },
      ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-bg-primary/80 backdrop-blur-lg border-b border-secondary-layer/50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-3">
              <Logo size={32} />
              <span className="text-xl font-bold text-text-primary">Nexora</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className={`font-medium transition-colors duration-200 ${location.pathname === link.path ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                  {link.label}
                </Link>
              ))}
            </div>
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-layer rounded-full">
                  <Zap size={16} className="text-gold" />
                  <span className="text-sm font-semibold text-gold">{totalXP.toLocaleString()} XP</span>
                </div>
                {!isRightNetwork && (
                  <button onClick={switchToRitual} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 rounded-full text-xs font-semibold text-red-400 hover:bg-red-500/30 transition-colors" title="Click to switch to Ritual Network">
                    <AlertTriangle size={14} /> Wrong Network
                  </button>
                )}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary-layer rounded-full">
                  <span className="w-2 h-2 rounded-full" style={{ background: isRightNetwork ? '#10B981' : '#EF4444' }} />
                  <span className="text-sm font-medium text-text-primary font-mono">{shortAddress}</span>
                </div>
                <button onClick={disconnectWallet} className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full bg-secondary-layer text-text-secondary hover:text-red-400 transition-colors" title="Disconnect wallet">
                  <LogOut size={16} />
                </button>
                <Link to="/profile" className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center hover:scale-105 transition-transform">
                  <span className="text-sm font-bold text-white">0x</span>
                </Link>
              </div>
            ) : (
              <button onClick={connectWallet} disabled={isConnecting} className="flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 bg-brand-purple hover:bg-brand-purple/80 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50">
                <Wallet size={18} />
                <span className="hidden sm:inline">{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                <span className="sm:hidden">{isConnecting ? '...' : 'Connect'}</span>
              </button>
            )}
          </div>
        </div>
      </nav>
      {isConnected && !isRightNetwork && (
        <div className="fixed top-16 lg:top-20 left-0 right-0 z-40 bg-red-500/10 border-b border-red-500/30 px-4 py-2 flex items-center justify-center gap-3">
          <AlertTriangle size={16} className="text-red-400" />
          <span className="text-sm text-red-400 font-medium">You are on the wrong network.</span>
          <button onClick={switchToRitual} className="text-sm text-red-400 font-bold underline hover:text-red-300">Switch to Ritual</button>
        </div>
      )}
    </>
  );
};

export default Navbar;
