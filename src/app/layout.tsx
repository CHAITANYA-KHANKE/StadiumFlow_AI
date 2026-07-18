import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StadiumProvider } from "@/context/StadiumContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StadiumFlow AI — Real-Time Stadium Operations & Smart Navigation",
  description: "GenAI-enabled operations control and accessible crowd-aware navigation for the FIFA World Cup 2026 challenge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-brand-cyan/30 selection:text-white">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <StadiumProvider>
          <main id="main-content" className="flex flex-col flex-grow">
            {children}
          </main>
        </StadiumProvider>
      </body>
    </html>
  );
}
