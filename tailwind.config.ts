import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0ea5e9",
          dark: "#0b4f66",
          light: "#e0f2fe"
        }
      },
      fontFamily: {
        display: ["ui-sans-serif", "system-ui"],
        body: ["ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
} satisfies Config;
