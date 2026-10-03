import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        solvorry: {
          dark: "#0B0F2B",      // Deepest indigo background
          mid: "#192561",       // Mid indigo gradient step
          DEFAULT: "#283A97",   // Primary Ace Select blue
          light: "#4A60D4",     // Light button blue
          accent: "#06B6D4",    // Cyan accent
        },
        brand: {
          dark: "#0B0F2B",
          mid: "#192561",
          DEFAULT: "#283A97",
          light: "#4A60D4",
        },
        navy: {
          mid: "#192561",
        },
        neutral: {
          50: "#F7F8FC",
          100: "#EEEEF8",
          200: "#DCDDF0",
          400: "#8A8AA3",
          600: "#4B4B5A",
          800: "#2B2B38",
          900: "#111118",
        },
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "sans-serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      backgroundImage: {
        "gradient-solvorry": "linear-gradient(180deg, #0B0F2B 0%, #192561 50%, #283A97 100%)",
        "gradient-banner": "linear-gradient(90deg, #0B0F2B 0%, #192561 50%, #0B0F2B 100%)",
      },
      animation: {
        "marquee": "marquee 30s linear infinite",
        "marquee-reverse": "marquee-reverse 35s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out infinite 3s",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
      },
      boxShadow: {
        "card": "0 20px 40px -10px rgba(40, 58, 151, 0.15)",
        "glow": "0 0 40px rgba(74, 96, 212, 0.4)",
        "glow-border": "0 0 0 10px rgba(74, 96, 212, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
