/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
      },
      colors: {
        forge: {
          bg:            'var(--forge-bg)',
          'bg-elevated': 'var(--forge-bg-elevated)',
          'bg-active':   'var(--forge-bg-active)',
          border:        'var(--forge-border)',
          text:          'var(--forge-text)',
          'text-muted':  'var(--forge-text-muted)',
          accent:        'var(--forge-accent)',
          'accent-hover':'var(--forge-accent-hover)',
          success:       'var(--forge-success)',
          warning:       'var(--forge-warning)',
          error:         'var(--forge-error)',
        },
      },
      spacing: {
        'activity-bar': '48px',
        'status-bar':   '22px',
      },
    },
  },
  plugins: [],
};

