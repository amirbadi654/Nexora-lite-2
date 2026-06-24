import React from 'react';
import { ExternalLink } from 'lucide-react';
import Logo from './Logo';

const socialLinks = [
  {
    name: 'X (Twitter)',
    url: 'https://x.com/Metipax',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Discord',
    url: 'https://discord.gg/yfdVK6dU',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
];

const Footer: React.FC = () => {
  return (
    <>
      <footer className="bg-bg-primary py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Logo & Tagline */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                <Logo size={28} />
                <span className="text-xl font-bold text-text-primary">Nexora</span>
              </div>
              <p className="text-text-secondary text-sm">
                Challenge Your Mind. Climb the Ranks.
              </p>
            </div>

            {/* Copyright */}
            <div className="text-center">
              <p className="text-text-secondary text-sm">
                © 2025 Nexora. All rights reserved.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center md:justify-end gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-secondary-layer rounded-lg text-text-secondary hover:text-text-primary hover:bg-brand-purple/20 transition-all duration-200 group"
                >
                  {link.icon}
                  <span className="text-sm font-medium">{link.name}</span>
                  <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Credit */}
      <div className="text-center mt-8">
        <p className="text-text-secondary text-xs">
          Built by Meti pax
        </p>
      </div>
    </>
  );
};

export default Footer;
