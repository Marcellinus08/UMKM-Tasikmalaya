import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    {
      pattern: /bg-(primary|accent|red|green|blue|yellow|purple|pink|orange|teal)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /text-(primary|accent|red|green|blue|yellow|purple|pink|orange|teal)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /animate-(pulse|bounce|spin|fade|slide)/,
    },
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6FFF7',
          100: '#B3FFE4',
          200: '#80FFD1',
          300: '#4DFFBE',
          400: '#1AFFAB',
          500: '#10B981',
          600: '#0D935E',
          700: '#0A6E3B',
          800: '#064A18',
          900: '#032505',
        },
        'background-light': '#F8FAFC',
        'background-dark': '#0F172A',
        'card-light': '#FFFFFF',
        'card-dark': '#1E293B',
        'text-light': '#1E293B',
        'text-dark': '#F1F5F9',
        'subtext-light': '#64748B',
        'subtext-dark': '#94A3B8',
        accent: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          pink: '#EC4899',
          orange: '#F97316',
          teal: '#14B8A6',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
      zIndex: {
        '1': '1',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}

export default config
