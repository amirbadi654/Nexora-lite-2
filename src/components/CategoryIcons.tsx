import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

export const BrainIcon: React.FC<IconProps> = ({ size = 24, color = '#8B5CF6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C10.5 2 9.2 2.8 8.5 4C7.8 3.4 6.9 3 6 3C4.3 3 3 4.3 3 6C3 7.1 3.6 8.1 4.5 8.7C4.2 9.4 4 10.2 4 11C4 12.9 5.1 14.5 6.7 15.3C6.3 16 6 16.9 6 17.8C6 19.6 7.4 21 9.2 21C10.2 21 11.1 20.5 11.7 19.8C12.3 20.5 13.2 21 14.2 21C16 21 17.4 19.6 17.4 17.8C17.4 16.9 17.1 16 16.7 15.3C18.3 14.5 19.4 12.9 19.4 11C19.4 10.2 19.2 9.4 18.9 8.7C19.8 8.1 20.4 7.1 20.4 6C20.4 4.3 19.1 3 17.4 3C16.5 3 15.6 3.4 14.9 4C14.2 2.8 12.9 2 12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8V12M12 12L10 10M12 12L14 10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FootballIcon: React.FC<IconProps> = ({ size = 24, color = '#38BDF8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <path
      d="M12 2C12 2 9 6 9 12C9 18 12 22 12 22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 2C12 2 15 6 15 12C15 18 12 22 12 22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M2 12H22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4.5 6.5L19.5 17.5M4.5 17.5L19.5 6.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const CircuitIcon: React.FC<IconProps> = ({ size = 24, color = '#10B981' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="9" width="6" height="6" rx="1" stroke={color} strokeWidth="2" />
    <path
      d="M9 12H3M15 12H21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 9V3M12 15V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="3" cy="12" r="1.5" fill={color} />
    <circle cx="21" cy="12" r="1.5" fill={color} />
    <circle cx="12" cy="3" r="1.5" fill={color} />
    <circle cx="12" cy="21" r="1.5" fill={color} />
    <path
      d="M6 6L9 9M15 15L18 18M6 18L9 15M15 9L18 6"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
