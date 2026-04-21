import type { Config } from "tailwindcss";

export default {

  darkMode: ["class"],

  content: [
    "./client/index.html",
    "./client/src/**/*.{js,jsx,ts,tsx}"
  ],

  theme: {
    extend: {

      borderRadius: {
        lg: "0.65rem",
        md: "0.5rem",
        sm: "0.25rem"
      },

      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)"
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)"
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)"
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)"
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)"
        },
        /* FMCIII Brand Palette */
        brand: {
          sky:      "#2EA3E0",
          orange:   "#F5941E",
          gold:     "#F7B731",
          charcoal: "#4D4D4F"
        }
      },

      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"]
      },

      boxShadow: {
        card: "0 2px 10px rgba(46,163,224,0.07)",
        float: "0 8px 24px rgba(46,163,224,0.10)",
        soft: "0 4px 16px rgba(46,163,224,0.08)",
        "primary-sm": "0 2px 8px rgba(46,163,224,0.20)",
        "primary-md": "0 4px 16px rgba(46,163,224,0.22)",
        "glass": "0 4px 20px rgba(46,163,224,0.07), inset 0 1px 0 rgba(255,255,255,0.9)"
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(.4,0,.2,1)",
        spring: "cubic-bezier(.34,1.56,.64,1)"
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        fadeInScale: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" }
        },
        shimmerSlide: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" }
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.6)" },
          to: { opacity: "1", transform: "scale(1)" }
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" }
        },
        staggerFadeIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        }
      },

      animation: {
        float: "float 3.5s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.4s ease both",
        "fade-in-scale": "fadeInScale 0.35s ease both",
        shimmer: "shimmerSlide 0.7s ease forwards",
        "scale-in": "scaleIn 0.36s cubic-bezier(.34,1.56,.64,1) both",
        "slide-in-left": "slideInLeft 0.3s ease both"
      }

    }
  },

  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography")
  ]

} satisfies Config;