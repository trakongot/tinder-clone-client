/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {
      gridTemplateColumns: {
        16: 'repeat(16, minmax(0, 1fr))'
      },
      gridColumn: {
        'span-13': 'span 13 / span 16'
      },
      colors: {
        primary: 'linear-gradient(to top right, #fd267a, #ff6036)'
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        '.container': {
          maxWidth: '1188px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }
      })
    })
  ]
}
