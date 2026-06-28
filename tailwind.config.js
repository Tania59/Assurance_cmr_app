/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        jetbrains: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        background: '#F7F8FA',
        foreground: '#1A1A2E',
        primary: '#0A3D6B',
        secondary: '#1A5A8A',
        success: '#1B9A6B',
        gold: '#D4A540',
        alert: '#E63946',
        muted: '#6B7280',
        border: '#E5E7EB',
        card: '#FFFFFF',
        orange: '#F59E0B',
      }
    },
  },
  plugins: [],
}