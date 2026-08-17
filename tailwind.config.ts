import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        background: "#FAFAFA",
        foreground: "#111827",
        primary: {
          DEFAULT: "#0F172A", // Black/Slate for primary brand (Editorial feel)
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#6B7280",
          foreground: "#F3F4F6",
        },
        surface: {
          DEFAULT: "#ffffff",
          variant: "#F9FAFB",
          border: "#E5E7EB",
        },
        accent: {
          DEFAULT: "#2563EB", // Blue for actual links/highlights
          foreground: "#ffffff",
        },
        error: {
          DEFAULT: "#DC2626",
          foreground: "#ffffff",
        }
      },
      borderRadius: {
        'sm': '2px',
        'md': '4px',
        'lg': '8px',
        'xl': '12px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'md': '0 2px 4px -1px rgba(0, 0, 0, 0.03), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'lg': '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
};
export default config;
