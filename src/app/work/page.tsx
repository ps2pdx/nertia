import Work from '@/components/sections/Work';
import Footer from '@/components/sections/Footer';
import PageContent from '@/components/PageContent';

export default function WorkPage() {
  return (
    <main className="pb-16">
      <PageContent>
        <Work />
        <Footer />
      </PageContent>
    </main>
  );
}
