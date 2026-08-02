import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        chia: {
          light: "#99cc33",
          DEFAULT: "#4d9900",
          dark: "#2f6b00",
          deep: "#14532d",
        },
      },
    },
  },
  plugins: [],
};
export default config;
