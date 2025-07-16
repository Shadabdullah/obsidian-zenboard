/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // Scan these files for classes
  important: '#zentask-container', // Ensures styles work in Obsidian's shadow DOM
  corePlugins: {
    preflight: false, // Disable default CSS reset (avoids Obsidian conflicts)
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
