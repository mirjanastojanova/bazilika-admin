/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // first solution, but got an error because of the {}
    // content: [
    //   "./app/**/*.{js,ts,jsx,tsx,mdx}",
    //   "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    //   "./components/**/*.{js,ts,jsx,tsx,mdx}",

    //   // Or if using `src` directory:
    //   "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // ],
    "./app/**/*.js",
    "./app/**/*.ts",
    "./app/**/*.jsx",
    "./app/**/*.tsx",
    "./pages/**/*.js",
    "./pages/**/*.ts",
    "./pages/**/*.jsx",
    "./pages/**/*.tsx",
    "./components/**/*.js",
    "./components/**/*.ts",
    "./components/**/*.jsx",
    "./components/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5542F6",
        highlight: '#AEE8FB'
      },
    },
  },
  plugins: [],
};
