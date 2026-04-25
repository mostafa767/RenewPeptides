import type { Metadata, Viewport } from "next";
import "./globals.css";
import PublicLayout from "@/components/PublicLayout";

export const metadata: Metadata = {
  title: {
    default: "RenewPeptides Pharmaceuticals — Quality You Can Verify",
    template: "%s | RenewPeptides Pharmaceuticals",
  },
  description:
    "RenewPeptides delivers pharmaceutical-grade products with industry-leading quality assurance. Every product features a unique QR verification code so you can confirm authenticity instantly.",
  keywords: [
    "RenewPeptides",
    "pharmaceuticals",
    "product verification",
    "authentic medications",
    "QR code verification",
  ],
  openGraph: {
    siteName: "RenewPeptides Pharmaceuticals",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
