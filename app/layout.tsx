import type { Metadata } from "next";
import { Geist, Geist_Mono, Merienda } from "next/font/google";
import "./globals.css";

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
        className={`${merienda.variable} ${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
