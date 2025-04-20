export const content = [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
    extend: {
        colors: {
            'whisper-purple': '#9F7AEA',
            'whisper-pink': '#ED64A6',
            'whisper-blue': '#4299E1',
            'whisper-dark': '#1A202C',
            'whisper-light': '#F7FAFC',
        },
        fontFamily: {
            'poetic': ['"Playfair Display"', 'serif'],
            'soft': ['"Quicksand"', 'sans-serif'],
        },
    },
};
export const plugins = [
    require('@tailwindcss/forms'),
];