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

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-black">
      <Navbar />
      <Hero />
      <About />
      <Showreel />
      <Marquee />
      <Portfolio />
      <Services />
      <Clients />
      <Crew />
      <Stats />
      <Contact />
      <Footer />
    </main>
  );
}
