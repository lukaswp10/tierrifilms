import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TIERRIFILMS | Producao de Video Profissional",
  description: "Transformamos momentos em historias cinematograficas. Producao de video, filmagem de eventos, edicao profissional e muito mais.",
  keywords: ["videomaker", "producao de video", "filmagem", "edicao de video", "eventos", "casamento", "corporativo"],
  authors: [{ name: "TIERRIFILMS" }],
  openGraph: {
    title: "TIERRIFILMS | Producao de Video Profissional",
    description: "Transformamos momentos em historias cinematograficas.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
