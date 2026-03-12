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
}

},

fontFamily: {
sans: ["var(--font-sans)"],
display: ["var(--font-display)"]
},

boxShadow: {

card: "0 4px 14px rgba(0,0,0,0.05)",

float: "0 10px 24px rgba(0,0,0,0.08)",

soft: "0 6px 20px rgba(0,0,0,0.06)"

},

transitionTimingFunction: {
smooth: "cubic-bezier(.4,0,.2,1)"
}

}
},

plugins: [
require("tailwindcss-animate"),
require("@tailwindcss/typography")
]

} satisfies Config;