// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // Import the Header

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "In Loving Memory of Mary Segu",
  description: "A digital celebration of a life beautifully lived.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-gray-900`}>
        <Header /> {/* Add the Header here */}
        <main>{children}</main> {/* Wrap children in main for good practice */}
      </body>
    </html>
  );
}