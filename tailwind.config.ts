import type { Config } from 'tailwindcss'

const config: Config = {
 
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      margin: {
        nested: '1.5rem', // 👈 your custom class: ml-nested
      },
    },
  },
  plugins: [],
}

export default config
