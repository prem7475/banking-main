import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/context/AppContext"; // <--- IMPORT THIS

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif'
})

export const metadata: Metadata = {
  title: "UdharPay",
  description: "Modern Banking Platform",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable} bg-black`}>
        {/* WRAP EVERYTHING INSIDE APP PROVIDER */}
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}