/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E2142D",
        "primary-dark": "#B01020",
        dark: "#1A1A2E",
        offwhite: "#F9F9F9",
        "light-gray": "#F2F2F2",
        muted: "#888888",
        "text-main": "#111111",
        "text-sub": "#555555",
        border: "#E5E5E5",
        success: "#1D9E75",
        warning: "#E8631A",
        error: "#DC2626",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      borderRadius: {
        btn: "10px",
        card: "12px",
        lg2: "20px",
      },

      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(-8px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        "count-up": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },

      animation: {
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
