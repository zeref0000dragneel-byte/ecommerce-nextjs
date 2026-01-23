/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#264653', // Azul oscuro - Confianza
          action: '#2A9D8F', // Verde azulado - Acción
          cta: '#E76F51', // Coral - Call To Action
          background: '#F8F9FA', // Fondo de página
          border: '#E9ECEF', // Borde sutil
        },
        spacing: {
          'xs': '8px',
          'sm': '16px',
          'md': '24px',
          'lg': '48px',
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }