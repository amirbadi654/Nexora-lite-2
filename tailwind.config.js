/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0F172A',
        'card': '#1E293B',
        'secondary-layer': '#273449',
        'brand-purple': '#8B5CF6',
        'interactive-cyan': '#38BDF8',
        'success-emerald': '#10B981',
        'gold': '#FBBF24',
        'text-primary': '#E6EDF7',
        'text-secondary': '#A8B3C7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #8B5CF6, #38BDF8)',
      },
    },
  },
  plugins: [],
};
