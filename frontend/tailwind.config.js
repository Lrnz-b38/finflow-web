module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#00a86b",
        secondary: "#00d084",
        accent: "#00f5a0",
        danger: "#ef4444",
        dark: {
          bg: "#0f172a",
          card: "#1e293b",
          border: "#334155",
        },
      },
      screens: {
        xs: "320px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
