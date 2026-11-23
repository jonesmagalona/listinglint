import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ListingLint: AI listing quality checker for used equipment",
  description:
    "Paste a messy used-equipment listing. AI extracts the details, and tested rules check what is missing, implausible or duplicated before it goes live.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
