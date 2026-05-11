import type { Metadata } from "next";
import { Geist, Geist_Mono, Merienda, Kalam } from "next/font/google";
import "./globals.css";

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: "400",
});

const merienda = Merienda({
  variable: "--font-merienda",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "File upload busboy - early rejection",
  description: "Simple file upload with early rejection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${kalam.variable} ${merienda.variable} ${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
