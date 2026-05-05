import ZeroPointPage from '@/components/sections/zero-point/ZeroPointPage';
import Footer from '@/components/sections/Footer';

export const metadata = {
    title: 'Zero-Point — nertia',
    description: 'Free, hosted websites that emerge from a brief. Coming soon. Join the launch list.',
};

export default function Page() {
    return (
        <>
            <ZeroPointPage />
            <Footer />
        </>
    );
}
