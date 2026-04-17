/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:         '#6AE000',
        'primary-light': '#8FFF20',
        'primary-dark':  '#4DB000',
        'primary-glow':  'rgba(106,224,0,0.12)',
        dark:            '#0D0D0D',
        card:            '#141414',
        elevated:        '#1F1F1F',
        modal:           '#111111',
        border:          '#2A2A2A',
        'border-subtle': '#1A1A1A',
        secondary:       '#A0A0A0',
        muted:           '#555555',
        danger:          '#FF4545',
        'danger-bg':     'rgba(255,69,69,0.10)',
        warning:         '#F5A623',
        'warning-bg':    'rgba(245,166,35,0.10)',
        info:            '#3D9CF0',
        'info-bg':       'rgba(61,156,240,0.10)',
        success:         '#6AE000',
        'success-bg':    'rgba(106,224,0,0.10)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
