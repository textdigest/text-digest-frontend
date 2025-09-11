import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '',
                    100: '',
                    200: '',
                    300: '',
                    400: '',
                    500: '',
                    600: '',
                    700: '',
                    800: '',
                    900: '',
                },
                neutral: {
                    50: '',
                    100: '',
                    200: '',
                    300: '',
                    400: '',
                    500: '',
                    600: '',
                    700: '',
                    800: '',
                    900: '',
                },
            },
        },
    },
};

export default config;
