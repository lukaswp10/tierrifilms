import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Showreel from '@/components/Showreel';
import Marquee from '@/components/Marquee';
import Portfolio from '@/components/Portfolio';
import Services from '@/components/Services';
import Clients from '@/components/Clients';
import Crew from '@/components/Crew';
import Stats from '@/components/Stats';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { getEquipe, getGaleriasPrincipais, getParceiros } from '@/lib/dados';

// Pagina gerada no servidor e renovada a cada 60s (e na hora quando o painel salva algo).
export const revalidate = 60;

export default async function Home() {
  const [galerias, parceiros, equipe] = await Promise.all([getGaleriasPrincipais(6), getParceiros(), getEquipe()]);

  return (
    <main className="relative w-full min-h-screen bg-black">
      <Navbar />
      <Hero />
      <About />
      <Showreel />
      <Marquee />
      <Portfolio galerias={galerias} />
      <Services />
      <Clients parceiros={parceiros} />
      <Crew equipe={equipe} />
      <Stats />
      <Contact />
      <Footer />
    </main>
  );
}
