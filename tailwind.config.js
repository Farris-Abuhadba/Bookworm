/** @type {import('tailwindcss').Config} */

import { fontFamily } from "tailwindcss/defaultTheme";

export const content = [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  extend: {
    fontFamily: {
      sans: ["Poppins", ...fontFamily.sans],
    },

    backgroundImage: {
      "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      "gradient-conic":
        "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
    },

    colors: {
      primary: {
        50: "rgb(var(--color-primary-50) / <alpha-value>)",
        100: "rgb(var(--color-primary-100) / <alpha-value>)",
        200: "rgb(var(--color-primary-200) / <alpha-value>)",
        300: "rgb(var(--color-primary-300) / <alpha-value>)",
        400: "rgb(var(--color-primary-400) / <alpha-value>)",
        500: "rgb(var(--color-primary-500) / <alpha-value>)",
        600: "rgb(var(--color-primary-600) / <alpha-value>)",
        700: "rgb(var(--color-primary-700) / <alpha-value>)",
        800: "rgb(var(--color-primary-800) / <alpha-value>)",
        900: "rgb(var(--color-primary-900) / <alpha-value>)",
      },

      secondary: {
        50: "rgb(var(--color-secondary-50) / <alpha-value>)",
        100: "rgb(var(--color-secondary-100) / <alpha-value>)",
        200: "rgb(var(--color-secondary-200) / <alpha-value>)",
        300: "rgb(var(--color-secondary-300) / <alpha-value>)",
        400: "rgb(var(--color-secondary-400) / <alpha-value>)",
        500: "rgb(var(--color-secondary-500) / <alpha-value>)",
        600: "rgb(var(--color-secondary-600) / <alpha-value>)",
        700: "rgb(var(--color-secondary-700) / <alpha-value>)",
        800: "rgb(var(--color-secondary-800) / <alpha-value>)",
        900: "rgb(var(--color-secondary-900) / <alpha-value>)",
      },

      accent: {
        50: "rgb(var(--color-accent-50) / <alpha-value>)",
        100: "rgb(var(--color-accent-100) / <alpha-value>)",
        200: "rgb(var(--color-accent-200) / <alpha-value>)",
        300: "rgb(var(--color-accent-300) / <alpha-value>)",
        400: "rgb(var(--color-accent-400) / <alpha-value>)",
        500: "rgb(var(--color-accent-500) / <alpha-value>)",
        600: "rgb(var(--color-accent-600) / <alpha-value>)",
        700: "rgb(var(--color-accent-700) / <alpha-value>)",
        800: "rgb(var(--color-accent-800) / <alpha-value>)",
        900: "rgb(var(--color-accent-900) / <alpha-value>)",
      },

      "sunset-purple": {
        50: "#f6e9ff",
        100: "#e6cfff",
        200: "#c89cff",
        300: "#a964ff",
        400: "#8f37fe",
        500: "#7e19fe",
        600: "#7609ff",
        700: "#6400e4",
        800: "#5900cc",
        900: "#4c00b3",
      },

      "sunset-pink": {
        50: "#ffebf3",
        100: "#fcd6e0",
        200: "#f1aabe",
        300: "#e77c9a",
        400: "#df567c",
        500: "#da3d68",
        600: "#d92f5f",
        700: "#c1214f",
        800: "#ad1945",
        900: "#990b3b",
      },

      "sunset-orange": {
        50: "#fff0e3",
        100: "#ffe1cc",
        200: "#ffc29b",
        300: "#ffa064",
        400: "#fe8337",
        500: "#fe711a",
        600: "#ff6809",
        700: "#e45600",
        800: "#cb4b00",
        900: "#b13f00",
      },
    },
  },
};
export const corePlugins = {
  preflight: true,
};
export const plugins = [];
