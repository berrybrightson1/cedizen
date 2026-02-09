import type { Metadata } from "next";
// Epilogue font hardcoded in globals.css
import "./test.css";
import "./globals.css";
import { SnackMenu } from "@/components/ui/SnackMenu";
import { Sidebar } from '@/components/ui/Sidebar';

// Inter font integration removed

export const metadata: Metadata = {
    title: "Cedizen | Ghana's Civic Empowerment Ecosystem",
    description: "Instant legal guidance, constitutional education, and case law access for every Ghanaian.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <div className="flex h-screen overflow-hidden bg-slate-100">
                    <Sidebar />
                    <main className="flex-1 flex flex-col min-h-0 relative">
                        <div className="flex-1 overflow-y-auto m-2 lg:m-6 bg-white rounded-premium shadow-sm border border-slate-200 relative pb-24 lg:pb-0">
                            {children}
                        </div>
                    </main>
                    {/* Mobile Navigation - Drawer Menu */}
                    <div className="lg:hidden">
                        <SnackMenu />
                    </div>
                </div>
            </body>
        </html>
    );
}
