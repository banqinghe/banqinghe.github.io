import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        'code': {
                            '&::before, &::after': {
                                display: 'none',
                            },
                        },
                        'blockquote p': {
                            '&::before, &::after': {
                                display: 'none',
                            },
                            'opacity': 0.7,
                            'font-style': 'normal',
                        },
                    },
                },
            },
        },
    },
    plugins: [typography],
};

export default config;
