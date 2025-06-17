/** @type {import('tailwindcss').Config} */
export default {
  // The 'content' array tells Tailwind where to scan for its utility classes.
  // It's crucial for Tailwind to generate the necessary CSS.
  content: [
    "./index.html", // Your main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // All JavaScript/TypeScript/JSX/TSX files in the src directory
  ],
  theme: {
    extend: {
      // You can extend Tailwind's default theme here.
      // For example, to add custom colors, fonts, spacing, etc.
    },
  },
  plugins: [
    // Add any Tailwind CSS plugins here (e.g., @tailwindcss/forms, @tailwindcss/typography)
  ],
}
