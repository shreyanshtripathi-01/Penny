import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: 'Penny. %s',
    default: 'Penny. | Absolute Financial Control',
  },
  description: "Stop feeding your financial data to bloated ad networks. Penny is a high-density, locally-parsed ledger designed for speed and complete ownership.",
  keywords: ["personal finance", "ledger", "brutalist design", "AI statement parser", "financial tracker", "expense manager"],
  authors: [{ name: "Penny Engineering" }],
  openGraph: {
    title: 'Penny. | Absolute Financial Control',
    description: "A high-density, locally-parsed ledger designed for speed and complete ownership.",
    url: 'https://penny-blond.vercel.app',
    siteName: 'Penny.',
    images: [
      {
        url: 'https://penny-blond.vercel.app/og-image.png', // Assuming a standard OG image path
        width: 1200,
        height: 630,
        alt: 'Penny. Brutalist Financial Dashboard',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Penny. | Absolute Financial Control',
    description: "A high-density, locally-parsed ledger designed for speed and complete ownership.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} h-full`}>
      <body className="min-h-full font-sans antialiased bg-[#f5f5f2] text-[#030213]">
        {children}
      </body>
    </html>
  );
}
