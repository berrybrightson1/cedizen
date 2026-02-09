import type { Metadata } from "next";
import "../test.css";
import "../globals.css";
import { AppLayoutWrapper } from "@/components/ui/AppLayoutWrapper";

export const metadata: Metadata = {
    title: "Cedizen | Ghana's Civic Empowerment Ecosystem",
    description: "Instant legal guidance, constitutional education, and case law access for every Ghanaian.",
};

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AppLayoutWrapper>
            {children}
        </AppLayoutWrapper>
    );
}
