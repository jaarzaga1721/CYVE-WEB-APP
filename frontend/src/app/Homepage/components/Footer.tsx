import Link from 'next/link';
import styles from './Footer.module.css';
import { TwitterIcon, GithubIcon, DiscordIcon } from './Icons';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            {/* Top scan line */}
            <div className={styles.topLine} />

            <div className={styles.container}>
                {/* Brand column */}
                <div className={styles.brand}>
                    <div className={styles.logoMark}>
                        <span className={styles.logoText}>CYVE</span>
                        <span className={styles.logoSub}>_OS</span>
                    </div>
                    <p className={styles.brandTagline}>
                        The tactical platform for the next generation of Philippine cybersecurity operatives.
                    </p>
                    <div className={styles.statusRow}>
                        <div className={styles.statusDot} />
                        <span className={styles.statusText}>SYSTEM_ONLINE // ALL_SERVICES_STABLE</span>
                    </div>
                    <div className={styles.socialIcons}>
                        <a href="https://twitter.com/cyve" className={styles.socialLink} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <TwitterIcon />
                        </a>
                        <a href="https://github.com/cyve" className={styles.socialLink} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <GithubIcon />
                        </a>
                        <a href="https://discord.gg/cyve" className={styles.socialLink} target="_blank" rel="noopener noreferrer" aria-label="Discord">
                            <DiscordIcon />
                        </a>
                    </div>
                </div>

                {/* Platform links */}
                <div className={styles.linksColumn}>
                    <h4 className={styles.linksHeading}>PLATFORM</h4>
                    <Link href="/" className={styles.navLink}>Home</Link>
                    <Link href="/roadmap" className={styles.navLink}>Roadmap</Link>
                    <Link href="/calendar" className={styles.navLink}>Mission Center</Link>
                    <Link href="/league" className={styles.navLink}>Cyber League</Link>
                </div>

                {/* Operations links */}
                <div className={styles.linksColumn}>
                    <h4 className={styles.linksHeading}>OPERATIONS</h4>
                    <Link href="/labs" className={styles.navLink}>Mission Labs</Link>
                    <Link href="/jobs" className={styles.navLink}>Job Board</Link>
                    <Link href="/profile" className={styles.navLink}>Operative Profile</Link>
                    <Link href="/contact" className={styles.navLink}>About CYVE</Link>
                </div>

                {/* Intel column */}
                <div className={styles.linksColumn}>
                    <h4 className={styles.linksHeading}>INTEL</h4>
                    <p className={styles.contactInfo}>📍 Angeles City, PH</p>
                    <p className={styles.contactInfo}>✉️ ops@cyve.com</p>
                    <p className={styles.contactInfo}>🔒 Clearance: All Operatives</p>
                </div>
            </div>

            {/* Bottom bar */}
            <div className={styles.bottom}>
                <span className={styles.copyright}>© 2026 CYVE_OS // TRANSMISSION_ENCRYPTED</span>
                <div className={styles.bottomRight}>
                    <span className={styles.versionTag}>v2.0-RELEASE</span>
                </div>
            </div>
        </footer>
    );
}
