import React from 'react';
import { Zap, Globe, TrendingUp } from 'lucide-react';
import Logo from './Logo';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary">
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Watermark Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Logo size={600} watermark className="blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-text-primary mb-2 leading-tight">
          Challenge Your Mind.
        </h1>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-secondary mb-8 leading-tight">
          Climb the Ranks.
        </h2>

        {/* Description */}
        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          AI-powered challenges. Web3 identity. Real competition.
        </p>

        {/* CTA Button */}
        <button className="group relative inline-flex items-center gap-3 px-8 py-4 lg:px-10 lg:py-5 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-purple/25">
          <span
            className="absolute inset-0 rounded-xl bg-gradient-brand opacity-100 group-hover:opacity-90 transition-opacity"
          />
          <Zap size={22} className="relative z-10" />
          <span className="relative z-10 text-lg">Connect Wallet to Start</span>
        </button>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-12">
          <div className="flex items-center gap-2 px-4 py-2 bg-card/50 border border-brand-purple/20 rounded-full text-text-secondary text-sm sm:text-base">
            <Zap size={16} className="text-brand-purple" />
            <span>AI Challenges</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card/50 border border-interactive-cyan/20 rounded-full text-text-secondary text-sm sm:text-base">
            <Globe size={16} className="text-interactive-cyan" />
            <span>Web3 Native</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card/50 border border-gold/20 rounded-full text-text-secondary text-sm sm:text-base">
            <TrendingUp size={16} className="text-gold" />
            <span>Earn XP & Rank Up</span>
          </div>
        </div>
      </div>

      {/* Gradient Overlay at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
    </section>
  );
};

export default Hero;
