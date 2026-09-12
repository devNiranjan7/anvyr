import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { ClerkProvider } from "@clerk/nextjs";
import AppContextProvider from "@/context/AppContext.jsx";
import { Toaster } from "react-hot-toast";

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
                    <body className="min-h-full flex flex-col">
                        <Toaster
                            toastOptions={{
                                success: {
                                    style: {
                                        background: "black",
                                        color: "white",
                                    },
                                },
                                error: {
                                    style: {
                                        background: "black",
                                        color: "white",
                                    },
                                },
                            }}
                        />
                        {children}
                    </body>
                </html>
            </AppContextProvider>
        </ClerkProvider>
    );
}
