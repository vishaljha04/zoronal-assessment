/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#aa3bff',
        'accent-bg': 'rgba(170, 59, 255, 0.1)',
        'accent-border': 'rgba(170, 59, 255, 0.5)',
        text: '#6b6375',
        'text-h': '#08060d',
        border: '#e5e4e7',
        'code-bg': '#f4f3ec',
        'social-bg': 'rgba(244, 243, 236, 0.5)',
      },
      fontFamily: {
        sans: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'Consolas', 'monospace'],
      },
      boxShadow: {
        custom: 'rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px',
      },
    },
  },
  plugins: [],
}

