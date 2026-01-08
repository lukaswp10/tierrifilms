import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Services from '@/components/Services';
import Stats from '@/components/Stats';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Portfolio />
      <Services />
      <Stats />
      <Contact />
      <Footer />
    </main>
  );
}
