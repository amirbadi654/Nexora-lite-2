import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  watermark?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 40, watermark = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient
          id={`brand-gradient-${watermark ? 'watermark' : 'main'}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      {/* Hexagonal outline */}
      <polygon
        points="20,2 36,11 36,29 20,38 4,29 4,11"
        fill="none"
        stroke={`url(#brand-gradient-${watermark ? 'watermark' : 'main'})`}
        strokeWidth="2"
        opacity={watermark ? 0.15 : 1}
      />
      {/* Neural network pattern - N letterform */}
      <path
        d="M12 12 L20 20 L12 28 M20 12 L28 20 L20 28"
        stroke={`url(#brand-gradient-${watermark ? 'watermark' : 'main'})`}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity={watermark ? 0.12 : 1}
      />
      {/* Connection nodes */}
      <circle cx="12" cy="12" r="1.5" fill="#8B5CF6" opacity={watermark ? 0.15 : 1} />
      <circle cx="12" cy="28" r="1.5" fill="#8B5CF6" opacity={watermark ? 0.15 : 1} />
      <circle cx="20" cy="20" r="1.5" fill="#38BDF8" opacity={watermark ? 0.15 : 1} />
      <circle cx="28" cy="20" r="1.5" fill="#38BDF8" opacity={watermark ? 0.15 : 1} />
      <circle cx="28" cy="28" r="1.5" fill="#38BDF8" opacity={watermark ? 0.15 : 1} />
    </svg>
  );
};

export default Logo;
