import type { Metadata } from "next";
import { Oswald } from 'next/font/google';
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { ConfigsProvider } from "@/lib/ConfigsContext";
import { getTodasConfiguracoes } from "@/lib/dados";

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-oswald',
});

const TITULO_PADRAO = 'TIERRIFILMS';
const DESCRICAO_PADRAO = 'Especialistas em captar momentos reais. Producao audiovisual para casamentos e eventos.';

export async function generateMetadata(): Promise<Metadata> {
  const configs = await getTodasConfiguracoes();
  return {
    title: configs['site_titulo'] || TITULO_PADRAO,
    description: configs['site_descricao'] || DESCRICAO_PADRAO,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Textos e cores do site vem prontos do servidor (sem "Carregando..." no navegador).
  const configs = await getTodasConfiguracoes();

  return (
    <html lang="pt-BR" className={oswald.variable}>
      <body className={`${oswald.className} antialiased`} style={{ backgroundColor: '#000000', color: '#ffffff' }}>
        <ConfigsProvider initialConfigs={configs}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ConfigsProvider>
      </body>
    </html>
  );
}
