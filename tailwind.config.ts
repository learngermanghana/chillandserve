import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        emeraldBrand: "#0F5C4D",
        goldBrand: "#D4AF37",
        ivoryBrand: "#F8F5EE",
        charcoalBrand: "#111827"
      },
      boxShadow: {
        premium: "0 18px 45px -18px rgba(17,24,39,0.35)"
      },
      borderRadius: {
        xl2: "1.1rem"
      }
    }
  },
  plugins: []
};

export default config;
