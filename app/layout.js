import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import AppContextProvider from "@/context/AppContext.jsx";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata = {
    title: "Anvyr",
    description:
        "Anvyr is a powerful AI assistant that helps you write better code faster.",
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <AppContextProvider>
                <html
                    lang="en"
                    className={`${inter.variable} h-full antialiased`}
                >
                    <body className="min-h-full flex flex-col">{children}</body>
                </html>
            </AppContextProvider>
        </ClerkProvider>
    );
}
