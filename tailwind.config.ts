import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      minHeight:{
        'custom': 'calc(calc(100vh - var(--navHeight)))'
      },
      borderRadius: {
        '50px': '50px'
      },
      transitionProperty: {
        height: 'height'
      },
      keyframes: {
        twinkling: {
          '0%, 60%, 100%': { 
            scale: '1',
          },
          '80%': {
            scale: '1.05',
          }
        },
        bgLinear: {
          '0%,100%': {
            backgroundPosition: 'left top'
          },
          '50%': {
            backgroundPosition: 'right bottom'
          }
        }
      }
    },
  },
  plugins: [],
}
export default config
