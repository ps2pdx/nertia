import Services from '@/components/sections/Services';
import Footer from '@/components/sections/Footer';
import PageContent from '@/components/PageContent';

export default function ServicesPage() {
  return (
    <main className="pb-24">
      <PageContent>
        <Services />
        <Footer />
      </PageContent>
    </main>
  );
}
