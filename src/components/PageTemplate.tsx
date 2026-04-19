import { ReactNode } from 'react';
import PageContent from './PageContent';
import Footer from './sections/Footer';

interface PageTemplateProps {
    children: ReactNode;
    /** Set to true for pages like homepage that handle their own footer */
    hideFooter?: boolean;
    /** Custom bottom padding class, defaults to pb-24 */
    paddingBottom?: string;
}

export default function PageTemplate({
    children,
    hideFooter = false,
    paddingBottom = 'pb-24'
}: PageTemplateProps) {
    return (
        <main className={paddingBottom}>
            <PageContent>
                {children}
                {!hideFooter && <Footer />}
            </PageContent>
        </main>
    );
}
