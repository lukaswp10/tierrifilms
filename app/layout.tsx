import type { Metadata } from "next";
import { Oswald } from 'next/font/google';
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { ConfigsProvider } from "@/lib/ConfigsContext";

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-oswald',
});

export const metadata: Metadata = {
  title: "TIERRIFILMS | Eternize o Real",
  description: "Especialistas em captar momentos reais. Producao audiovisual para casamentos e eventos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={oswald.variable}>
      <body className={`${oswald.className} antialiased`} style={{ backgroundColor: '#000000', color: '#ffffff' }}>
        <ConfigsProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ConfigsProvider>
      </body>
    </html>
  );
}
