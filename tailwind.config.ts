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
        border: "rgba(255,255,255,0.08)",
        background: "#0a0015",
        foreground: "#f5f0ff",
        "phase-menstrual": "#f43f5e",
        "phase-follicular": "#a855f7",
        "phase-ovulation": "#f0abfc",
        "phase-luteal": "#fb923c",
        "hw-purple": "#c084fc",
        "hw-violet": "#7c3aed",
        "hw-pink": "#db2777",
        "hw-muted": "#9b8db0",
        "hw-subtle": "#6b5a8a",
        "hw-text": "#c4b5d8",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hw-gradient": "linear-gradient(160deg, #18062a 0%, #1e0738 60%, #12042a 100%)",
        "hw-cta": "linear-gradient(135deg, #7c3aed, #db2777)",
      },
      keyframes: {
        moonPulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(1.08)" },
        },
        starTwinkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(1)" },
          "50%": { opacity: "0.05", transform: "scale(0.6)" },
        },
        dotBounce: {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "50%": { transform: "translateY(-5px)", opacity: "1" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "moon-pulse": "moonPulse 4s ease-in-out infinite",
        "star-twinkle": "starTwinkle 3s ease-in-out infinite",
        "dot-bounce": "dotBounce 1.2s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.4s ease forwards",
      },
    },
  },
  plugins: [],
};
export default config;
