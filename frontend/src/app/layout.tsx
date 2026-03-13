'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/app/Homepage/components/Header';
import Footer from '@/app/Homepage/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { RoadmapProvider } from '@/context/RoadmapContext';
import { CalendarProvider } from '@/context/CalendarContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { ToastProvider } from '@/context/ToastContext';
import { StreakProvider } from '@/context/StreakContext';
import { usePathname } from 'next/navigation';
import SetOperativeNameModal from '@/components/auth/SetOperativeNameModal';

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    variable: '--font-inter',
});

function LayoutContent({ children }: { children: React.ReactNode }) {
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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.variable} suppressHydrationWarning>
                <ToastProvider>
                    <AuthProvider>
                        <ProfileProvider>
                            <RoadmapProvider>
                                <CalendarProvider>
                                    <StreakProvider>
                                        <LayoutContent>
                                            {children}
                                        </LayoutContent>
                                    </StreakProvider>
                                </CalendarProvider>
                            </RoadmapProvider>
                        </ProfileProvider>
                    </AuthProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
