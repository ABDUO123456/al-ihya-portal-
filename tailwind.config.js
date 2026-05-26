/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f1115",
        surface: "#1a1d23",
        "surface-light": "#242830",
        primary: "#10b981", // Emerald Green
        secondary: "#d4af37", // Gold
        accent: "#00d1ff", // Keep a bit of the ice blue for highlights
        emerald: "#10b981",
        ruby: "#ef4444",
        gold: "#fbbf24",
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
        tajawal: ["Tajawal", "sans-serif"],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
