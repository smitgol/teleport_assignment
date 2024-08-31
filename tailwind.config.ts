import type { Config } from "tailwindcss";



const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor: {
        'secondary': '#1C1C1C',
        'dark-gray': '#FFFFFF08',
        'light-gray': '#FFFFFF1A',
        'primary': '#312EB5',
      },
      borderColor: {
        'dark-gray': '#FFFFFF08',
        'light-gray': '#FFFFFF1A',
      },
      textColor: {
        'gray': '#FFFFFF99',
        'light-gray': '#FFFFFF66',
      },
    },
  },
  plugins: [],
};
export default config;
