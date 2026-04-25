import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          400: "#818CF8",
          600: "#1E3A5F",
          700: "#162D4F",
          800: "#0F2340",
          900: "#0A1628",
          950: "#060D1A",
        },
        brand: {
          DEFAULT: "#1E3A5F",
          light: "#2A5298",
          accent: "#0284C7",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #0A1628 0%, #1E3A5F 50%, #2A5298 100%)",
        "card-gradient":
          "linear-gradient(135deg, #1E3A5F 0%, #2A5298 100%)",
      },
      boxShadow: {
        "card":
          "0 4px 24px -4px rgba(10, 22, 40, 0.12), 0 2px 8px -2px rgba(10, 22, 40, 0.08)",
        "card-hover":
          "0 12px 40px -8px rgba(10, 22, 40, 0.18), 0 4px 16px -4px rgba(10, 22, 40, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
