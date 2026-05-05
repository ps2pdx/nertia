import type { Metadata } from 'next';
import LabPage from '@/components/sections/lab/LabPage';

export const metadata: Metadata = {
    title: 'Lab — nertia',
    description: 'Work in progress. Snippets, prototypes, asset starters. Nothing here ships.',
};

export default function Page() {
    return <LabPage />;
}
