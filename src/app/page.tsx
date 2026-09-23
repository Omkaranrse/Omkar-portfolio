import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Overview from '@/components/Overview';
import Work from '@/components/Work';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Interactions from '@/components/Interactions';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <main id="main">
        <About />
        <Experience />
        <Overview />
        <Work />
        <Contact />
      </main>
      <Footer />
      <Interactions />
    </>
  );
}

