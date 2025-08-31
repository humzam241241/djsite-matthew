import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-primary': "#0ea5e9",
        'brand-dark': "#0b4f66",
        'brand-light': "#e0f2fe",
      },
      fontFamily: {
        display: ["ui-sans-serif", "system-ui"],
        body: ["ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
} satisfies Config;
