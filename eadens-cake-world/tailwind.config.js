/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(30, 70%, 98%)",  // Ensure background is defined
        foreground: "hsl(342, 75%, 17%)",
        border: "hsl(342, 30%, 80%)",
      },
    },
  },
  plugins: [],
};
