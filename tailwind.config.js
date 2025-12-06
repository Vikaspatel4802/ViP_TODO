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
        // High visibility colors
        vip: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#0d9488', // Darker teal for better text contrast
          600: '#0f766e',
          700: '#115e59',
          900: '#134e4a',
        },
        slate: {
          850: '#1e293b', // Deep dark background
          900: '#0f172a', // Darkest background
        }
      }
    },
  },
  plugins: [],
}