import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HerWave — Cycle Syncing & Women's Health",
  description: "AI-powered cycle syncing and women's health companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
