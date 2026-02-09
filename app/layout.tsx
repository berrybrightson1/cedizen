import type { Metadata } from "next";
// Epilogue font hardcoded in globals.css
import "./test.css";
import "./globals.css";

export const metadata: Metadata = {
    title: "Cedizen | Ghana's Civic Empowerment Ecosystem",
    description: "Instant legal guidance, constitutional education, and case law access for every Ghanaian.",
};

import { ConvexClientProvider } from "@/components/ConvexClientProvider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <ConvexClientProvider>
                    {children}
                </ConvexClientProvider>
            </body>
        </html>
    );
}
