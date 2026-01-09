import { notFound } from 'next/navigation';
import { getGaleriaPorSlug, getFotosDaGaleria, getTodasGalerias } from '@/lib/supabase';
import GaleriaDetalhes from '@/components/GaleriaDetalhes';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const galerias = await getTodasGalerias();
  return galerias.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const galeria = await getGaleriaPorSlug(slug);
  
  if (!galeria) {
    return { title: 'Galeria nao encontrada' };
  }
  
  return {
    title: `${galeria.nome} | Tierrifilms`,
    description: galeria.descricao || `Veja o projeto ${galeria.nome}`,
  };
}

export const revalidate = 60;

export default async function GaleriaSlugPage({ params }: Props) {
  const { slug } = await params;
  const galeria = await getGaleriaPorSlug(slug);
  
  if (!galeria) {
    notFound();
  }
  
  const fotos = await getFotosDaGaleria(galeria.id);
  
  return <GaleriaDetalhes galeria={galeria} fotos={fotos} />;
}

