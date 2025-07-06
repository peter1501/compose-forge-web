import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ComposeForge - Jetpack Compose Components Marketplace",
  description: "Discover, share, and generate high-quality Material 3 components for Jetpack Compose",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="compose-forge-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}