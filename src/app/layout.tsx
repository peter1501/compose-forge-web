import type { Metadata } from "next";
import { ServiceProvider } from "@/presentation/contexts/ServiceProvider";
import "./globals.css";

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
    <html lang="en">
      <body>
        <ServiceProvider>
          {children}
        </ServiceProvider>
      </body>
    </html>
  );
}