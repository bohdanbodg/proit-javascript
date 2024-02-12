/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/views/**/*.hbs", "./node_modules/flowbite/**/*.js"],
  theme: {
    container: {
      center: true,
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "base",
    }),
    require("flowbite/plugin"),
  ],
};
