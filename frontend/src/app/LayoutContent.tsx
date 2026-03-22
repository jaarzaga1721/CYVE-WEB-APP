'use client';

import Header from '@/app/Homepage/components/Header';
import Footer from '@/app/Homepage/components/Footer';
import { usePathname } from 'next/navigation';
import SetOperativeNameModal from '@/components/auth/SetOperativeNameModal';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isLeaguePage = pathname === '/league' || pathname?.startsWith('/league/');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1 }}>
                {children}
            </main>
            <SetOperativeNameModal />
            {!isAuthPage && <Footer />}
        </div>
    );
}
