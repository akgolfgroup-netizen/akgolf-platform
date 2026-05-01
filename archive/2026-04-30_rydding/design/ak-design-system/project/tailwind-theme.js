// AK Golf Group — Tailwind CSS Theme Extension
// Legg dette i tailwind.config.js under theme.extend

module.exports = {
  theme: {
    extend: {
      colors: {
        akgolf: {
          primary: '#005840',
          accent: '#D1F843',
          surface: '#ECF0EF',
          text: '#324D45',
          ink: '#0A1F18',
          muted: '#A5B2AD',
          dark: '#0A1F18',
          'card-dark': '#0D2E23',
          'card-light': '#FFFFFF',
          'primary-light': '#B8D4CC',
          success: '#2A7D5A',
          'success-bg': '#E8F5EF',
          warning: '#C48A32',
          'warning-bg': '#FDF4E4',
          danger: '#B84233',
          'danger-bg': '#FCEAE8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        pill: '20px',
      },
      boxShadow: {
        'akgolf': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'akgolf-dark': '0 4px 20px rgba(0, 0, 0, 0.25)',
        'akgolf-glow': '0 0 20px rgba(209, 248, 67, 0.08)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
};
