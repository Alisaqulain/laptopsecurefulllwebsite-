import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-orbitron)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand colors
        electric: {
          50: "#e6f4ff",
          100: "#bde0ff",
          200: "#7cc2ff",
          300: "#3aa4ff",
          400: "#0086ff",
          500: "#0078ff",
          600: "#0061d6",
          700: "#0049a3",
          800: "#003270",
          900: "#001a3d",
        },
        neon: {
          50: "#fff4e6",
          100: "#ffd9b3",
          200: "#ffbd80",
          300: "#ffa14d",
          400: "#ff851a",
          500: "#ff6b00",
          600: "#e65f00",
          700: "#b34a00",
          800: "#803500",
          900: "#4d2000",
        },
        silver: {
          50: "#f7f8fa",
          100: "#e8ebf0",
          200: "#cfd4dc",
          300: "#a8b0bd",
          400: "#7a8493",
          500: "#5a6371",
          600: "#454c57",
          700: "#363c45",
          800: "#262a31",
          900: "#1a1d22",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "grid-pattern":
          "linear-gradient(to right, rgba(0, 120, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 120, 255, 0.06) 1px, transparent 1px)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "glow-blue":
          "0 0 20px rgba(0, 120, 255, 0.5), 0 0 40px rgba(0, 120, 255, 0.3)",
        "glow-orange":
          "0 0 20px rgba(255, 107, 0, 0.5), 0 0 40px rgba(255, 107, 0, 0.3)",
        "glow-soft": "0 0 30px rgba(0, 120, 255, 0.2)",
        premium:
          "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(0, 120, 255, 0.4), 0 0 40px rgba(0, 120, 255, 0.2)",
          },
          "50%": {
            boxShadow:
              "0 0 30px rgba(0, 120, 255, 0.7), 0 0 60px rgba(0, 120, 255, 0.4)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shine: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "slide-up": {
          "0%": { transform: "translateY(40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        spotlight: {
          "0%": { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-x": "gradient-x 8s ease infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shine: "shine 3s linear infinite",
        "slide-up": "slide-up 0.6s ease-out forwards",
        marquee: "marquee 30s linear infinite",
        spotlight: "spotlight 2s ease .75s 1 forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
