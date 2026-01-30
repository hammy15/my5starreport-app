import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "my5STARreport.com | Skilled Nursing 5-Star Analysis Tool",
  description: "The industry expert on 5-star ratings for skilled nursing facilities. Analyze CMS data, improve ratings, and access training resources with 5 Star Phil.",
  keywords: "nursing home, 5-star rating, CMS, skilled nursing, HPRD, PBJ, quality measures, health inspections",
  metadataBase: new URL('https://my5starreport.com'),
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
  },
  openGraph: {
    title: 'my5STARreport.com | CMS 5-Star Rating Analysis Tool',
    description: 'Improve your nursing home ratings with data-driven insights. Analyze CMS data, benchmark competitors, and build improvement plans.',
    url: 'https://my5starreport.com',
    siteName: 'my5STARreport.com',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'my5STARreport.com | CMS 5-Star Rating Analysis Tool',
    description: 'Improve your nursing home ratings with data-driven insights.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
