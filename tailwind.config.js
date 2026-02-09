/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                brand: {
                    gold: "#C5A358",
                    emerald: "#124A32",
                    crimson: "#8B0000",
                    slate: "#0f172a",
                },
                surface: "#ffffff",
                accent: {
                    DEFAULT: "#2563eb",
                    hover: "#1d4ed8",
                },
                panic: "#ef4444",
            },
            borderRadius: {
                'premium': '3rem',
            },
            boxShadow: {
                'premium-sm': '0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)',
                'premium-md': '0 10px 15px -3px rgba(15, 23, 42, 0.05), 0 4px 6px -4px rgba(15, 23, 42, 0.05)',
                'premium-lg': '0 25px 50px -12px rgba(15, 23, 42, 0.12)',
            },
        },
    },
    plugins: [],
}
