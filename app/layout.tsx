import type { Metadata } from "next";
import { Oswald } from 'next/font/google';
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { ConfigsProvider } from "@/lib/ConfigsContext";
import { createClient } from '@supabase/supabase-js';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-oswald',
});

// Busca configs do banco para metadata (server-side)
async function getMetadataConfigs(): Promise<{ titulo: string; descricao: string }> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data } = await supabase
      .from('configuracoes')
      .select('chave, valor')
      .in('chave', ['site_titulo', 'site_descricao']);
    
    const configs = (data || []).reduce((acc, item) => {
      acc[item.chave] = item.valor || '';
      return acc;
    }, {} as Record<string, string>);
    
    return {
      titulo: configs['site_titulo'] || 'TIERRIFILMS',
      descricao: configs['site_descricao'] || 'Especialistas em captar momentos reais. Producao audiovisual para casamentos e eventos.',
    };
  } catch {
    return {
      titulo: 'TIERRIFILMS',
      descricao: 'Especialistas em captar momentos reais. Producao audiovisual para casamentos e eventos.',
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { titulo, descricao } = await getMetadataConfigs();
  
  return {
    title: titulo,
    description: descricao,
  };
}

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
