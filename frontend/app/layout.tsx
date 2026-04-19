import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import DarkModeProvider from "@/components/DarkModeProvider";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter"
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "YouTube Trend Advisor",
  description: "Discover what's trending for your content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <head />
      <body className="min-h-screen font-sans antialiased">
        <DarkModeProvider>
          {children}
        </DarkModeProvider>
      </body>
    </html>
  );
}
