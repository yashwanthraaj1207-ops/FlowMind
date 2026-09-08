/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        iqoo: {
          orange: '#FF6B00',
          amber: '#FF8A00',
          yellow: '#FFB800',
        },
        flow: {
          cyan: '#00E5FF',
          blue: '#0284C7',
          violet: '#8B5CF6',
          emerald: '#10B981',
          rose: '#F43F5E',
        },
        dark: {
          950: '#070A0F',
          900: '#0B0F17',
          850: '#101622',
          800: '#151D2C',
          700: '#1E293B',
          600: '#334155',
          500: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-cyan': 'glowCyan 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glowCyan: {
          '0%': { boxShadow: '0 0 5px rgba(0, 229, 255, 0.2), 0 0 10px rgba(0, 229, 255, 0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(0, 229, 255, 0.4), 0 0 25px rgba(0, 229, 255, 0.2)' },
        }
      }
    },
  },
  plugins: [],
}

