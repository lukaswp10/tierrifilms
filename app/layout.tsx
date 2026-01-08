import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="pt-BR">
      <body className="antialiased" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
        {children}
      </body>
    </html>
  );
}
