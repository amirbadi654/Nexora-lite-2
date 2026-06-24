import React, { useState, useEffect } from 'react';
import { Wallet, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useWallet } from '../context/WalletContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isConnected, walletAddress, connectWallet } = useWallet();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-bg-primary/80 backdrop-blur-lg border-b border-secondary-layer/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <Logo size={32} />
            <span className="text-xl font-bold text-text-primary">Nexora</span>
          </Link>

          {/* Nav Links - Center */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          {isConnected ? (
            <div className="flex items-center gap-3">
              {/* XP Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-layer rounded-full">
                <Zap size={16} className="text-gold" />
                <span className="text-sm font-semibold text-gold">1,250 XP</span>
              </div>

              {/* Wallet Address */}
              <div className="hidden sm:flex items-center px-3 py-1.5 bg-secondary-layer rounded-full">
                <span className="text-sm font-medium text-text-primary">{walletAddress}</span>
              </div>

              {/* Profile Avatar */}
              <Link to="/profile" className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center hover:scale-105 transition-transform">
                <span className="text-sm font-bold text-white">0x</span>
              </Link>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 bg-brand-purple hover:bg-brand-purple/80 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
            >
              <Wallet size={18} />
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
