import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0B1F3A",
        "navy-deep": "#061226",
        "navy-tint": "#15315A",
        gold: "#D4AF37",
        "gold-deep": "#B89126",
        "gold-soft": "#E6C76A",
        forest: "#1E3A2A",
        black: "#111111",
        white: "#F5F5F5",
        sand: "#D8C7AE",
        wine: "#7A1E23",
        graphite: "#2A2A2A",
        offwhite: "#F8F6F0",
        muted: "#666666"
      },
      fontFamily: {
        display: ["var(--font-display)", "Cinzel", "serif"],
        rune: ["var(--font-display-rune)", "Cinzel", "serif"],
        editorial: ["var(--font-editorial)", "Cormorant Garamond", "serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
        ui: ["var(--font-ui)", "Montserrat", "sans-serif"]
      },
      borderRadius: {
        xs: "2px",
        sm: "4px",
        md: "6px",
        lg: "10px",
        xl: "16px"
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-lg": "var(--shadow-card-lg)",
        foil: "var(--shadow-foil)",
        dark: "var(--shadow-dark)"
      },
      transitionTimingFunction: {
        magn: "cubic-bezier(0.22, 0.61, 0.36, 1)"
      },
      letterSpacing: {
        display: "0.06em",
        caps: "0.18em"
      }
    }
  },
  plugins: []
};

export default config;
