import { ReactNode } from 'react';

interface PageContentProps {
    children: ReactNode;
}

export default function PageContent({ children }: PageContentProps) {
    return <div>{children}</div>;
}
