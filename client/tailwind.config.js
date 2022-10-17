/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    require.resolve("react-widgets/styles.css"),
  ],
  theme: {
    extend: {},
  },
  plugins: [require("react-widgets-tailwind")],
};
