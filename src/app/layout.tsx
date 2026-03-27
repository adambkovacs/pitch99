import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pitch99 — 99 Problems, But This Pitch Ain't One",
  description:
    "AI-powered 99-second pitch generator. Turn your product into a stunning pitch in minutes, not hours.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
