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
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        pizza: {
          red: {
            light: '#fef2f2',
            DEFAULT: '#dc2626',
            dark: '#b91c1c',
          },
          yellow: {
            light: '#fefce8',
            DEFAULT: '#eab308',
            dark: '#ca8a04',
          },
          green: {
            light: '#f0fdf4',
            DEFAULT: '#16a34a',
            dark: '#15803d',
          },
        },
      },
      maxWidth: {
        content: '100rem', // 1600px — широкая рабочая область для десктопа
      },
    },
  },
  plugins: [],
};

export default config;
