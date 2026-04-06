import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui, // <--- On utilise l'import ici au lieu de require()
  ],
  daisyui: {
    themes: ["Halloween"], 
  },
}