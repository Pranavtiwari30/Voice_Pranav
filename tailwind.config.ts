import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'soundwave-1': 'soundwave 1.2s ease-in-out infinite',
        'soundwave-2': 'soundwave 1.4s ease-in-out infinite 0.2s',
        'soundwave-3': 'soundwave 1.1s ease-in-out infinite 0.4s',
        'soundwave-4': 'soundwave 1.5s ease-in-out infinite 0.1s',
        'soundwave-5': 'soundwave 1.3s ease-in-out infinite 0.3s',
      },
      keyframes: {
        soundwave: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '32px' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
