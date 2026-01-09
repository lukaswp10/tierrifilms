import { getTodasGalerias } from '@/lib/supabase';
import GaleriaList from '@/components/GaleriaList';

export const metadata = {
  title: 'Galeria | Tierrifilms',
  description: 'Veja todos os nossos trabalhos',
};

export const revalidate = 60;

export default async function GaleriaPage() {
  const galerias = await getTodasGalerias();
  
  return <GaleriaList galerias={galerias} />;
}

