/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        accent: "#00ffe7",
        accent2: "#ff6b35",
        bg: "#080c14",
        bg2: "#0d1220",
        card: "#101827",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        blink: "blink 0.8s step-end infinite",
        typing: "typing 3s steps(30,end) forwards",
        "fade-up": "fadeUp 0.6s ease forwards",
        glitch1: "glitch1 3.5s infinite",
        glitch2: "glitch2 3.5s infinite",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        blink: { "50%": { borderColor: "transparent" } },
        typing: { from: { width: "0" }, to: { width: "100%" } },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glitch1: {
          "0%,90%,100%": { transform: "translate(0)", opacity: "0" },
          "92%": { transform: "translate(-3px, 1px)", opacity: "1" },
          "94%": { transform: "translate(3px, -1px)", opacity: "1" },
          "96%": { transform: "translate(0)", opacity: "0" },
        },
        glitch2: {
          "0%,88%,100%": { transform: "translate(0)", opacity: "0" },
          "90%": { transform: "translate(3px, -2px)", opacity: "1" },
          "92%": { transform: "translate(-2px, 1px)", opacity: "1" },
          "94%": { transform: "translate(0)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
