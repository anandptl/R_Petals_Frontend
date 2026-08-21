/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'inverse-surface': '#303031',
        'surface-bright': '#ffffff',
        'on-background': '#1b1c1c',
        'on-secondary-container': '#636262',
        outline: '#8d7072',
        'on-primary-fixed-variant': '#2e541a',
        'surface-tint': '#4c8b2b',
        'on-primary-container': '#c4e1b4',
        'surface-container-highest': '#f2f0f0',
        'on-surface-variant': '#5a4042',
        'on-tertiary-fixed-variant': '#474744',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#4f4f4c',
        'surface-container-lowest': '#ffffff',
        primary: '#4c8b2b',
        'secondary-fixed': '#e5e2e1',
        'primary-fixed-dim': '#c4e1b4',
        'secondary-container': '#f2f0f0',
        tertiary: '#4c8b2b',
        'secondary-fixed-dim': '#c8c6c5',
        'primary-fixed': '#e8f5e1',
        'surface-dim': '#f5f3f3',
        'tertiary-fixed': '#e4e2dd',
        error: '#ba1a1a',
        'on-primary': '#ffffff',
        'on-tertiary-fixed': '#1b1c19',
        'error-container': '#ffdad6',
        secondary: '#5f5e5e',
        'on-primary-fixed': '#1a330e',
        'surface-container': '#F4F1EA',
        'primary-container': '#4c8b2b',
        'on-surface': '#1b1c1c',
        surface: '#fbf9f8',
        'inverse-primary': '#c4e1b4',
        'on-secondary': '#ffffff',
        'tertiary-fixed-dim': '#c8c6c2',
        'on-secondary-fixed': '#1c1b1b',
        background: '#fbf9f8',
        'surface-container-high': '#F0EDE4',
        'on-error-container': '#93000a',
        'surface-variant': '#E8E4D9',
        'on-tertiary-container': '#c2c1bc',
        'inverse-on-surface': '#f2f0f0',
        'on-secondary-fixed-variant': '#474746',
        'surface-container-low': '#FAF8F2',
        'outline-variant': '#DED9CC',
        'on-error': '#ffffff'
      },
      spacing: {
        'margin-desktop': '64px',
        gutter: '24px',
        'container-max': '1600px',
        unit: '8px',
        'margin-mobile': '20px',
        base: '4px',
        sm: '16px',
        xs: '8px',
        xl: '80px',
        lg: '48px',
        md: '24px'
      },
      fontFamily: {
        'body-lg': ['var(--font-hanken)', 'sans-serif'],
        'body-md': ['var(--font-hanken)', 'sans-serif'],
        'label-sm': ['var(--font-hanken)', 'sans-serif'],
        'label-lg': ['var(--font-hanken)', 'sans-serif'],
        'headline-lg': ['var(--font-garamond)', 'serif'],
        'headline-md': ['var(--font-garamond)', 'serif'],
        'headline-xl': ['var(--font-garamond)', 'serif'],
        'headline-xl-mobile': ['var(--font-garamond)', 'serif'],
        'display-lg': ['var(--font-garamond)', 'serif']
      },
      fontSize: {
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'label-sm': ['12px', { lineHeight: '1', letterSpacing: '0.1em', fontWeight: '600' }],
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.05em', fontWeight: '600' }],
        'headline-lg': ['48px', { lineHeight: '1.2', fontWeight: '500' }],
        'headline-md': ['32px', { lineHeight: '1.3', fontWeight: '500' }],
        'headline-xl': ['64px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '500' }],
        'headline-xl-mobile': ['40px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '500' }],
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '600' }]
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(76, 139, 43, 0.08)'
      }
    }
  },
  plugins: []
};
