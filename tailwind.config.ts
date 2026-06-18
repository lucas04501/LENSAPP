import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "xs": "400px",
      },
      colors: {
        // Shadcn UI
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // LENS Design System
        background: "hsl(var(--background))",
        surface: "#0D0D0D",
        "surface-2": "#111111",
        "surface-3": "#161616",
        "border-glow": "#A855F720",

        // Accents
        purple: {
          DEFAULT: "#A855F7",
          dim: "#A855F730",
          glow: "#A855F750",
          dark: "#7C3AED",
          light: "#C084FC",
        },
        red: {
          DEFAULT: "#EF4444",
          dim: "#EF444420",
          glow: "#EF444450",
          dark: "#DC2626",
          light: "#F87171",
        },

        // Text
        "text-primary": "#F8F8F8",
        "text-secondary": "#A0A0A0",
        "text-muted": "#505050",

        // Status
        success: "#22C55E",
        warning: "#F59E0B",
        info: "#3B82F6",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        display: ["Cal Sans", "Inter", "sans-serif"],
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-neon": "linear-gradient(135deg, #A855F7, #EF4444)",
        "gradient-purple": "linear-gradient(135deg, #A855F7, #7C3AED)",
        "gradient-glass": "linear-gradient(135deg, rgba(168,85,247,0.05), rgba(239,68,68,0.05))",
        "noise": "url('/noise.png')",
      },

      boxShadow: {
        "neon-purple": "0 0 20px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.1)",
        "neon-red": "0 0 20px rgba(239, 68, 68, 0.3), 0 0 60px rgba(239, 68, 68, 0.1)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.5)",
        "inner-glow": "inset 0 0 20px rgba(168, 85, 247, 0.05)",
      },

      borderRadius: {
        "xl": "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },

      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
      },

      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)" },
          "100%": { boxShadow: "0 0 40px rgba(168, 85, 247, 0.5), 0 0 80px rgba(168, 85, 247, 0.2)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },

      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
