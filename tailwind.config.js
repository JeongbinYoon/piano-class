/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      height: {
        525: "525px",
      },
      minWidth: {
        350: "350px",
      },
      colors: {
        brand: "rgb(2 132 199);",
        button: "rgb(255, 165, 0)",
      },
    },
  },
  plugins: [],
};
