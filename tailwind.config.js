/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F4F4F0',
        ink: {
          DEFAULT: '#171717',
          secondary: '#525252',
          muted: '#737373',
        },
        brutal: {
          surface: '#FFFFFF',
          dark: '#171717',
          cream: '#F4F4F0',
          accent: '#2563EB',
          alert: '#DC2626',
          warning: '#EAB308',
          success: '#16A34A',
        }
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px 0px #171717',
        'brutal': '4px 4px 0px 0px #171717',
        'brutal-lg': '6px 6px 0px 0px #171717',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
