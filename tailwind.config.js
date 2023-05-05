/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}', './src/app/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            keyframes: {
                fadeOut: {
                    '0%': { opacity: 1 },
                    '100%': { opacity: 0 },
                },
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                fadeInAndOut: {
                    '0%': { opacity: 0 },
                    '10%': { opacity: 1 },
                    '100%': { opacity: 0 },
                },
            },
            animation: {
                EnterScene: 'fadeOut 4s forwards',
                FadeOut: 'fadeOut 2s forwards',
                FadeIn: 'fadeIn 2s forwards',
                FadeInAndOut: 'fadeInAndOut 3s ease-in-out',
            },
        },
    },
    plugins: [],
}
