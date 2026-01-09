import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Admin - Tierrifilms',
  description: 'Painel de administracao do Tierrifilms',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen bg-gray-950 text-white ${inter.className}`}>
      {children}
    </div>
  );
}

