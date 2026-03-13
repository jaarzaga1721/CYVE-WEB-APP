'use client';

import { useState } from 'react';
import styles from './contact.module.css';
import { ShieldIcon, TargetIcon, UserIcon } from '@/app/Homepage/components/Icons';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', subject: '', message: '' });
            }, 5000);
        }, 1200);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroInner}>
                    <div className={styles.terminalLine}>
                        <span className={styles.prompt}>admin@cyve:~$</span>
                        <span className={styles.cmd}> cat about.txt</span>
                    </div>
                    <h1 className={styles.heroTitle}>CYVE_PLATFORM</h1>
                    <p className={styles.heroSub}>MISSION_BRIEF // BUILDING THE NEXT GENERATION OF CYBER OPERATIVES</p>
                </div>
            </section>

            {/* Mission cards */}
            <section className={styles.pillarsSection}>
                <h2 className={styles.sectionHeading}>CORE_DIRECTIVES</h2>
                <div className={styles.pillarsGrid}>
                    <div className={styles.pillarCard} style={{ '--accent': 'var(--color-red-team)' } as React.CSSProperties}>
                        <div className={styles.pillarIcon}><TargetIcon width={36} height={36} color="#e05252" /></div>
                        <h3 style={{ color: 'var(--color-red-team)' }}>OFFENSIVE_MASTERY</h3>
                        <p>Develop the attacker mindset. Learn penetration testing, exploit development, and red team methodologies through structured, hands-on missions.</p>
                    </div>
                    <div className={styles.pillarCard} style={{ '--accent': 'var(--color-blue-team)' } as React.CSSProperties}>
                        <div className={styles.pillarIcon}><ShieldIcon width={36} height={36} color="#4a9eff" /></div>
                        <h3 style={{ color: 'var(--color-blue-team)' }}>DEFENSIVE_EXCELLENCE</h3>
                        <p>Master threat detection, incident response, and SOC operations. Build the skills employers demand in today's frontline security roles.</p>
                    </div>
                    <div className={styles.pillarCard} style={{ '--accent': 'var(--color-purple-team)' } as React.CSSProperties}>
                        <div className={styles.pillarIcon}><UserIcon width={36} height={36} color="#9b59f5" /></div>
                        <h3 style={{ color: 'var(--color-purple-team)' }}>TACTICAL_COLLABORATION</h3>
                        <p>Bridge the gap between red and blue. Coordinate strategies, share threat intelligence, and build the hybrid expertise that advanced teams need.</p>
                    </div>
                </div>
            </section>

            {/* Why CYVE */}
            <section className={styles.whySection}>
                <div className={styles.whyGrid}>
                    <div className={styles.whyContent}>
                        <div className={styles.sectionTag}>WHY_CYVE</div>
                        <h2 className={styles.whyTitle}>The Path to Cyber Excellence Starts Here</h2>
                        <p>Cybersecurity is one of the most impactful — and in-demand — careers in the Philippines today. CYVE gives you structured guidance, the right tools, and a clear career roadmap.</p>
                        <ul className={styles.whyList}>
                            <li><span className={styles.bullet}>→</span> Personalized Red / Blue / Purple team roadmaps</li>
                            <li><span className={styles.bullet}>→</span> Curated PH cybersecurity job listings</li>
                            <li><span className={styles.bullet}>→</span> Interactive skill labs and mission challenges</li>
                            <li><span className={styles.bullet}>→</span> CIPHER AI mentor for 24/7 tactical guidance</li>
                            <li><span className={styles.bullet}>→</span> Season-based XP and rank progression system</li>
                        </ul>
                    </div>
                    <div className={styles.statsPanel}>
                        {[
                            { val: '3', label: 'CAREER TRACKS' },
                            { val: '6+', label: 'SKILL LABS' },
                            { val: '9+', label: 'PH JOB LISTINGS' },
                            { val: '24/7', label: 'CIPHER AI ONLINE' },
                        ].map(s => (
                            <div key={s.label} className={styles.statBox}>
                                <div className={styles.statVal}>{s.val}</div>
                                <div className={styles.statLabel}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact form */}
            <section id="contact" className={styles.contactSection}>
                <h2 className={styles.sectionHeading}>OPEN_COMMS_CHANNEL</h2>
                <div className={styles.contactGrid}>
                    {/* Info column */}
                    <div className={styles.infoColumn}>
                        {[
                            { icon: '📍', label: 'HQ_LOCATION', value: 'Angeles City, Philippines' },
                            { icon: '✉️', label: 'SECURE_CHANNEL', value: 'ops@cyve.com' },
                            { icon: '🛡️', label: 'READINESS', value: 'OPERATIONAL 24/7' },
                        ].map(item => (
                            <div key={item.label} className={styles.infoItem}>
                                <div className={styles.infoIcon}>{item.icon}</div>
                                <div>
                                    <div className={styles.infoLabel}>{item.label}</div>
                                    <div className={styles.infoValue}>{item.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <div className={styles.formPanel}>
                        {submitted ? (
                            <div className={styles.successState}>
                                <div className={styles.successIcon}>✓</div>
                                <h3>TRANSMISSION_RECEIVED</h3>
                                <p>Logged to HQ comms. Response inbound within 24h.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formRow}>
                                    <div className={styles.field}>
                                        <label className={styles.label}>OPERATIVE_NAME</label>
                                        <input name="name" className={styles.input} placeholder="Juan Dela Cruz" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className={styles.field}>
                                        <label className={styles.label}>SECURE_EMAIL</label>
                                        <input name="email" type="email" className={styles.input} placeholder="juan@email.com" value={formData.email} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>OBJECTIVE</label>
                                    <select name="subject" className={styles.input} value={formData.subject} onChange={handleChange} required>
                                        <option value="">Select objective...</option>
                                        <option>Feature Request</option>
                                        <option>Bug Report</option>
                                        <option>Partnership Inquiry</option>
                                        <option>Career Mentorship</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>MISSION_BRIEF</label>
                                    <textarea name="message" className={styles.textarea} placeholder="Describe your objective in detail..." value={formData.message} onChange={handleChange} required rows={5} />
                                </div>
                                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                                    {isLoading ? 'TRANSMITTING...' : 'TRANSMIT_MESSAGE →'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
