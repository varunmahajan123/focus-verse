import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#08111f",
        night: "#020712",
        cream: "#f8f1e8",
        lavender: "#dcd4ff",
        sage: "#dbe8d0",
        mist: "#cfe9ff",
        coral: "#ffb7a1",
        electric: "#006dff"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 60px rgba(59, 167, 255, 0.45)",
        soft: "0 28px 90px rgba(12, 22, 44, 0.15)"
      },
      opacity: {
        6: "0.06",
        8: "0.08",
        12: "0.12",
        14: "0.14",
        18: "0.18",
        22: "0.22",
        28: "0.28",
        34: "0.34",
        42: "0.42",
        48: "0.48",
        52: "0.52",
        62: "0.62",
        72: "0.72",
        82: "0.82"
      },
      borderRadius: {
        focus: "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
