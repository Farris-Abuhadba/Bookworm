/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      colors: {
        polo: {
          50: "#f2f7fb",
          100: "#e8f0f7",
          200: "#d5e4f0",
          300: "#bcd1e5",
          400: "#a0b9d9",
          500: "#8ca4ce",
          600: "#6f84bc",
          700: "#5e71a4",
          800: "#4e5e85",
          900: "#44506b",
          950: "#272d3f",
        },

        lavender: {
          50: "#f2f4fb",
          100: "#e8eaf7",
          200: "#d5daf0",
          300: "#bcc2e5",
          400: "#a0a3d9",
          500: "#8e8dce",
          600: "#7770bb",
          700: "#665ea4",
          800: "#534e85",
          900: "#46446b",
          950: "#2a283e",
        },
      },
    },
  },
  plugins: [],
};
