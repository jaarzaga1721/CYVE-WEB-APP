'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/config';
import styles from './Header.module.css';

export default function Header() {
    const pathname = usePathname();
    const { isAuthenticated, user, logout, loading } = useAuth();
    const [pendingCount, setPendingCount] = useState(0);

    const isActive = (path: string) => pathname === path;
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    // Poll for pending link requests to show notification dot
    useEffect(() => {
        if (!isAuthenticated || isAuthPage) return;
        const fetchPending = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/network/pending.php`, { credentials: 'include' });
                const data = await res.json();
                if (data.success) setPendingCount(data.total_pending ?? 0);
            } catch { /* silent */ }
        };
        fetchPending();
        const interval = setInterval(fetchPending, 60000); // refresh every 60s
        return () => clearInterval(interval);
    }, [isAuthenticated, isAuthPage]);

    if (isAuthPage) {
        return null;
    }

    const formatUsername = (name: string) => {
        if (!name) return 'Operative';
        const cleanName = name.replace(/[0-9]/g, '');
        return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    };

    const displayName = user?.display_name || (user?.name ? formatUsername(user.name) : 'Operative');

    return (
        <header className={styles.header}>
            <div className={styles.commandBar}>
                <Link href="/" className={styles.logo} aria-label="CYVE Home">
                    <div className={styles.logoIcon}>
                        <Image
                            src="/design-specs/images/52_31.png"
                            alt="CYVE"
                            width={40}
                            height={40}
                            className={styles.logoImg}
                        />
                    </div>
                </Link>

                <nav className={styles.nav} aria-label="Main Navigation">
                    <Link
                        href="/"
                        className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
                        aria-label="Home"
                    >
                        <span className={styles.navText}>HOME</span>
                        <div className={styles.indicator}></div>
                    </Link>
                    <Link
                        href="/contact"
                        className={`${styles.navLink} ${isActive('/contact') ? styles.active : ''}`}
                        aria-label="About"
                    >
                        <span className={styles.navText}>ABOUT</span>
                        <div className={styles.indicator}></div>
                    </Link>

                    {isAuthenticated && (
                        <>
                            <Link
                                href="/roadmap"
                                className={`${styles.navLink} ${isActive('/roadmap') ? styles.active : ''}`}
                                aria-label="Roadmap"
                            >
                                <span className={styles.navText}>ROADMAP</span>
                                <div className={styles.indicator}></div>
                            </Link>
                            <Link
                                href="/calendar"
                                className={`${styles.navLink} ${isActive('/calendar') ? styles.active : ''}`}
                                aria-label="Missions Calendar"
                            >
                                <span className={styles.navText}>MISSIONS</span>
                                <div className={styles.indicator}></div>
                            </Link>
                        </>
                    )}

                    <Link
                        href="/league"
                        className={`${styles.navLink} ${isActive('/league') || pathname?.startsWith('/league/') ? styles.active : ''}`}
                        aria-label="League"
                    >
                        <span className={styles.navText}>LEAGUE</span>
                        <div className={styles.indicator}></div>
                    </Link>
                    {isAuthenticated && (
                        <Link
                            href="/network"
                            className={`${styles.navLink} ${isActive('/network') ? styles.active : ''}`}
                            aria-label="Operative Network"
                            style={{ position: 'relative' }}
                        >
                            <span className={styles.navText}>NETWORK</span>
                            <div className={styles.indicator}></div>
                            {pendingCount > 0 && (
                                <span className={styles.notifDot} aria-label={`${pendingCount} pending link requests`} />
                            )}
                        </Link>
                    )}
                    <Link
                        href="/labs"
                        className={`${styles.navLink} ${isActive('/labs') ? styles.active : ''}`}
                        aria-label="Labs"
                    >
                        <span className={styles.navText}>LABS</span>
                        <div className={styles.indicator}></div>
                    </Link>
                    {isAuthenticated && (
                        <Link
                            href="/jobs"
                            className={`${styles.navLink} ${isActive('/jobs') ? styles.active : ''}`}
                            aria-label="Jobs"
                        >
                            <span className={styles.navText}>JOBS</span>
                            <div className={styles.indicator}></div>
                        </Link>
                    )}
                </nav>

                <div className={styles.actions}>
                    {!loading && (
                        isAuthenticated ? (
                            <div className={styles.profileMonitor}>
                                <Link href="/profile" className={styles.avatar} aria-label="User Profile">
                                    <div className={styles.avatarInner}>
                                        {displayName.charAt(0)}
                                    </div>
                                    <span className={styles.statusDot}></span>
                                </Link>
                                <div className={styles.monitorInfo}>
                                    <span className={styles.monitorName}>{displayName}</span>
                                    <button onClick={logout} className={styles.btnQuickLogout}>
                                        DISCONNECT
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.authGroup}>
                                <Link href="/login" className={styles.btnAccess}>
                                    ACCESS
                                </Link>
                                <Link href="/signup" className={styles.btnJoin}>
                                    JOIN_UNIT
                                </Link>
                            </div>
                        )
                    )}
                </div>
            </div>
        </header>
    );
}
