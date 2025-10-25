/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: { surface: "rgba(60,83,79,0.45)" },
      borderRadius: { "3xl": "1.5rem" },
      boxShadow: {
        glass: "0 10px 24px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,0.04)"
      }
    },
  },
  plugins: [],
};
