import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/app/Homepage/components/Header';
import Footer from '@/app/Homepage/components/Footer';
import { Providers } from './Providers';
import LayoutContent from './LayoutContent';

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    variable: '--font-inter',
});

export const metadata = {
    title: 'CYVE | Cybersecurity Platform',
    description: 'The tactical cybersecurity dominance platform for Philippine operatives.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.variable} suppressHydrationWarning>
                <Providers>
                    <LayoutContent>
                        {children}
                    </LayoutContent>
                </Providers>
            </body>
        </html>
    );
}
