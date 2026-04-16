module.exports = {
  darkMode: 'class',
  content: ['./src/client/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'j-blue':   '#0052CC',
        'j-navy':   '#0747A6',
        'j-sky':    '#4C9AFF',
        'j-green':  '#00875A',
        'j-yellow': '#FF991F',
        'j-red':    '#DE350B',
        'j-ink':    '#172B4D',
        'j-sub':    '#5E6C84',
        'j-mist':   '#97A0AF',
        'j-snow':   '#F4F5F7',
        'j-card':   '#FFFFFF',
        'j-line':   '#DFE1E6',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
