import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pathfolio — Discover the experience you didn't know you had.",
  description: "An experience-discovery platform that turns informal activities into a real resume.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Manrope:wght@300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
