import { ReactNode } from 'react';

interface PageTemplateProps {
  children: ReactNode;
  hideFooter?: boolean;
  paddingBottom?: string;
}

export default function PageTemplate({
  children,
  paddingBottom = 'pb-24',
}: PageTemplateProps) {
  return (
    <main className={`pt-24 ${paddingBottom} min-h-screen`}>
      {children}
    </main>
  );
}
