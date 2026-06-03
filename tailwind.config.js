/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#0a0a0a',
        surface: '#111111',
        panel: '#161616',
        edge: '#222222',
        dim: '#3a3a3a',
        muted: '#666666',
        neon: '#00ff9f',
        amber: '#ffb800',
        hot: '#ff3e3e',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
