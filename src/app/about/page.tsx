import About from '@/components/sections/About';
import Footer from '@/components/sections/Footer';
import PageContent from '@/components/PageContent';

export default function AboutPage() {
  return (
    <main className="pb-24">
      <PageContent>
        <About />
        <Footer />
      </PageContent>
    </main>
  );
}
