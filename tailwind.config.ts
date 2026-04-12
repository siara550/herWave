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
        border: "hsl(270 20% 88%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(270 10% 15%)",
      },
      backgroundImage: {
        'wave-gradient': 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 50%, #ffffff 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
