import { ReactNode } from 'react';

interface PageContentProps {
    children: ReactNode;
}

export default function PageContent({ children }: PageContentProps) {
    return (
        <div className="pt-[80px]">
            {children}
        </div>
    );
}
