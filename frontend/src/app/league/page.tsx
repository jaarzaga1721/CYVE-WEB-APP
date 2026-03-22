'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import styles from './league.module.css';

interface TeamCard {
    id: 'red' | 'blue' | 'purple';
    name: string;
    subtitle: string;
    description: string;
    role: string;
    tasks: string[];
    color: string;
    link: string;
    gradient: string;
    glow: string;
}

const teams: TeamCard[] = [
    {
        id: 'red',
        name: 'Red Team',
        subtitle: 'Offensive Security',
        description: 'Simulate real-world attacks to test security defenses',
        role: 'Penetration Testers & Ethical Hackers',
        tasks: [
            'Penetration Testing',
            'Vulnerability Assessment',
            'Exploit Development',
            'Social Engineering',
            'Web Application Security'
        ],
        color: '#e05252',
        link: '/league/red-team',
        gradient: 'linear-gradient(160deg, #2a0808 0%, #1a0505 40%, #0d0303 100%)',
        glow: 'rgba(224, 82, 82, 0.2)'
    },
    {
        id: 'purple',
        name: 'Purple Team',
        subtitle: 'Hybrid Security',
        description: 'Bridge offensive and defensive security operations',
        role: 'Security Consultants & Threat Analysts',
        tasks: [
            'Threat Intelligence',
            'Security Testing',
            'Collaboration Facilitation',
            'Metrics & Reporting',
            'Training & Education'
        ],
        color: '#9b59f5',
        link: '/league/purple-team',
        gradient: 'linear-gradient(160deg, #1a0828 0%, #120518 40%, #0a0310 100%)',
        glow: 'rgba(155, 89, 247, 0.2)'
    },
    {
        id: 'blue',
        name: 'Blue Team',
        subtitle: 'Defensive Security',
        description: 'Protect systems and respond to security incidents',
        role: 'SOC Analysts & Incident Responders',
        tasks: [
            'SOC Operations',
            'Incident Response',
            'Thread Detection',
            'Security Monitoring',
            'Forensics Analysis'
        ],
        color: '#4a9eff',
        link: '/league/blue-team',
        gradient: 'linear-gradient(160deg, #081428 0%, #050d1a 40%, #030810 100%)',
        glow: 'rgba(74, 158, 255, 0.2)'
    }
];

interface CohortData {
    id: string;
    name: string;
    batch: string;
    team: 'red' | 'blue' | 'purple';
    teamColor: string;
    status: 'ACTIVE' | 'ENROLLING' | 'UPCOMING';
    org: { name: string; description: string; founded: string; website: string };
    mentor: { name: string; role: string; };
    schedule: { start: string; end: string; cadence: string; time: string; };
    curriculum: string[];
    operatives: { total: number; slots: number; members: { name: string; rank: string }[] };
    requirements: string[];
    btnLabel: string;
}

const COHORTS: CohortData[] = [
    {
        id: 'ph-alpha',
        name: 'PH ALPHA',
        batch: 'BATCH 01',
        team: 'red',
        teamColor: '#e05252',
        status: 'ACTIVE',
        org: {
            name: 'CYVE Offensive Security Division',
            description: 'The first Philippine cohort dedicated to offensive security training, culminating in a live red team exercise against simulated enterprise infrastructure.',
            founded: 'Jan 2026',
            website: 'https://cyve.ph/red'
        },
        mentor: { name: 'Lt. Cmdr. Alex Reyes', role: 'Lead Penetration Tester • OSCP • CEH' },
        schedule: { start: 'Jan 15, 2026', end: 'Jul 15, 2026', cadence: 'Every Saturday', time: '09:00 – 12:00 PHT' },
        curriculum: [
            'Module 01 — Network Reconnaissance & OSINT',
            'Module 02 — Exploitation Fundamentals',
            'Module 03 — Web Application Attacks',
            'Module 04 — Post-Exploitation & Pivoting',
            'Module 05 — Active Directory Attacks',
            'Module 06 — Live Red Team Capstone'
        ],
        operatives: {
            total: 42,
            slots: 50,
            members: [
                { name: 'J. Santos', rank: 'Specialist' },
                { name: 'M. Cruz', rank: 'Operative' },
                { name: 'R. Garcia', rank: 'Operative' },
                { name: 'A. Reyes', rank: 'Expert' },
                { name: 'C. Lim', rank: 'Trainee' },
            ]
        },
        requirements: ['CompTIA Security+', 'Basic Linux CLI', 'Networking Fundamentals'],
        btnLabel: 'JOIN UNIT'
    },
    {
        id: 'ph-bravo',
        name: 'PH BRAVO',
        batch: 'BATCH 02',
        team: 'blue',
        teamColor: '#4a9eff',
        status: 'ACTIVE',
        org: {
            name: 'CYVE Defensive Operations Wing',
            description: 'A defensive-focused cohort building SOC analysts and incident responders ready to monitor, triage, and neutralize threats in a live SIEM environment.',
            founded: 'Feb 2026',
            website: 'https://cyve.ph/blue'
        },
        mentor: { name: 'Analyst Maya Ocampo', role: 'Senior SOC Lead • Splunk Certified • GCIH' },
        schedule: { start: 'Feb 01, 2026', end: 'Aug 01, 2026', cadence: 'Every Sunday', time: '14:00 – 17:00 PHT' },
        curriculum: [
            'Module 01 — Security Monitoring & SIEM',
            'Module 02 — Log Analysis & Threat Correlation',
            'Module 03 — Incident Response Playbooks',
            'Module 04 — Digital Forensics Fundamentals',
            'Module 05 — Threat Intelligence & IOC Hunting',
            'Module 06 — Live IR Capstone Exercise'
        ],
        operatives: {
            total: 55,
            slots: 60,
            members: [
                { name: 'P. Dela Cruz', rank: 'Specialist' },
                { name: 'L. Bautista', rank: 'Operative' },
                { name: 'K. Tan', rank: 'Expert' },
                { name: 'N. Gomez', rank: 'Trainee' },
                { name: 'V. Ramos', rank: 'Operative' },
            ]
        },
        requirements: ['CompTIA Security+', 'Basic Networking', 'Familiarity with Log Analysis'],
        btnLabel: 'JOIN UNIT'
    },
    {
        id: 'ph-charlie',
        name: 'PH CHARLIE',
        batch: 'BATCH 03',
        team: 'purple',
        teamColor: '#9b59f5',
        status: 'ENROLLING',
        org: {
            name: 'CYVE Hybrid Strategy Unit',
            description: 'The elite purple team cohort that bridges offensive and defensive operations, focusing on threat modeling, red-blue collaboration, and ATT&CK framework mastery.',
            founded: 'Apr 2026',
            website: 'https://cyve.ph/purple'
        },
        mentor: { name: 'Dr. Carlo Villanueva', role: 'Chief Security Strategist • CISSP • ATT&CK Practitioner' },
        schedule: { start: 'Apr 20, 2026', end: 'Oct 20, 2026', cadence: 'Every Saturday & Sunday', time: '10:00 – 13:00 PHT' },
        curriculum: [
            'Module 01 — ATT&CK Framework & Threat Modeling',
            'Module 02 — Offensive Emulation Planning',
            'Module 03 — Detection Engineering',
            'Module 04 — Purple Team Collaboration Protocols',
            'Module 05 — Metrics, Reporting & KPIs',
            'Module 06 — Full-Spectrum Capstone'
        ],
        operatives: {
            total: 18,
            slots: 30,
            members: [
                { name: 'S. Aquino', rank: 'Recruit' },
                { name: 'D. Flores', rank: 'Recruit' },
                { name: 'I. Mendez', rank: 'Trainee' },
            ]
        },
        requirements: ['Completion of a Red or Blue Team cohort', 'Security+', 'MITRE ATT&CK Basics'],
        btnLabel: 'ENROLL NOW'
    }
];

interface CtfData {
    id: string;
    name: string;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    accentColor: string;
    shortDesc: string;
    fullDesc: string;
    dates: string;
    registrationDeadline: string;
    platform: string;
    website: string;
    format: string;
    teamSize: string;
    categories: string[];
    prizes: string[];
    eligibility: string;
    existingTeams: { name: string; members: number; slots: number }[];
}

const CTF_OPERATIONS: CtfData[] = [
    {
        id: 'htb-cyber-apocalypse',
        name: 'HackTheBox: Cyber Apocalypse',
        difficulty: 'ADVANCED',
        accentColor: '#e53935',
        shortDesc: 'Global CTF competition spanning 5 days focusing on Web, Crypto, Pwn, and Forensics.',
        fullDesc: 'Cyber Apocalypse is HackTheBox\'s flagship annual CTF. Teams compete across hundreds of challenges spanning Web Exploitation, Binary Exploitation (Pwn), Cryptography, Forensics, Reversing, and more. The event draws thousands of teams globally, making it one of the most prestigious CTF competitions in the world.',
        dates: 'May 10 - May 15, 2026',
        registrationDeadline: 'May 9, 2026',
        platform: 'HackTheBox',
        website: 'https://ctf.hackthebox.com',
        format: 'Online (Jeopardy-style)',
        teamSize: '1 – 10 members',
        categories: ['Web Exploitation', 'Binary Exploitation', 'Cryptography', 'Forensics', 'Reversing', 'Misc'],
        prizes: ['$5,000 USD (1st)', '$2,500 USD (2nd)', '$1,000 USD (3rd)', 'HackTheBox Pro subscriptions', 'Exclusive merchandise'],
        eligibility: 'Open to all. Individual and team participation allowed.',
        existingTeams: [
            { name: 'CYVE_Alpha', members: 6, slots: 4 },
            { name: 'PH_Offensive', members: 8, slots: 2 },
            { name: 'Binary_Wolves', members: 3, slots: 7 },
        ]
    },
    {
        id: 'rootcon-2026',
        name: 'Rootcon 2026 Qualifications',
        difficulty: 'INTERMEDIATE',
        accentColor: '#f5a623',
        shortDesc: 'The official qualifier round for the Philippines\' premier hacker conference.',
        fullDesc: 'ROOTCON is the Philippines\' premier hacker conference CTF, drawing the nation\'s top security professionals and students. The qualification round is conducted online and the top teams advance to the on-site finals held in Cebu City during the ROOTCON conference. Challenges focus on real-world Philippine enterprise environments.',
        dates: 'July 24 - July 26, 2026',
        registrationDeadline: 'July 20, 2026',
        platform: 'Online (PH)',
        website: 'https://www.rootcon.org',
        format: 'Online Quals → On-site Finals (Cebu)',
        teamSize: '1 – 5 members',
        categories: ['Web Security', 'Network Forensics', 'Reverse Engineering', 'Social Engineering', 'OSINT'],
        prizes: ['₱50,000 (Finals 1st)', '₱25,000 (Finals 2nd)', 'ROOTCON Conference access', 'Certification vouchers'],
        eligibility: 'Philippines-based teams only for on-site finals. Online quals open to all.',
        existingTeams: [
            { name: 'CYVE_PH_01', members: 3, slots: 2 },
            { name: 'Luzon_Sec', members: 4, slots: 1 },
        ]
    },
    {
        id: 'picoctf-2026',
        name: 'PicoCTF 2026',
        difficulty: 'BEGINNER',
        accentColor: '#4caf50',
        shortDesc: 'A free computer security education program with original content built on a CTF framework.',
        fullDesc: 'PicoCTF is a free cybersecurity program designed by Carnegie Mellon University (CMU) for beginners to intermediate players. The platform offers a wide range of progressively difficult challenges to help competitors build foundational skills in all areas of cybersecurity. It\'s the perfect entry point for operatives new to competitive security.',
        dates: 'Sept 01 - Sept 14, 2026',
        registrationDeadline: 'Aug 31, 2026',
        platform: 'CMU / picoCTF.org',
        website: 'https://picoctf.org',
        format: 'Online (Jeopardy-style)',
        teamSize: '1 – 5 members',
        categories: ['General Skills', 'Cryptography', 'Web Exploitation', 'Forensics', 'Reversing', 'Binary Exploitation'],
        prizes: ['Certificates of achievement', 'CMU recognition', 'Scholarship consideration for top PH teams'],
        eligibility: 'Open to all. Recommended for students and those new to CTF competitions.',
        existingTeams: [
            { name: 'CYVE_Rookies', members: 2, slots: 3 },
            { name: 'PH_Beginners', members: 1, slots: 4 },
            { name: 'NextGen_Ops', members: 4, slots: 1 },
        ]
    }
];

export default function LeaguePage() {
    const [currentIndex, setCurrentIndex] = useState(1); // Start with Purple in center
    const { profile, updateProfile } = useProfile();
    const { isAuthenticated } = useAuth();
    const { callApi, loading: apiLoading } = useApi();
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [selectedCohort, setSelectedCohort] = useState<CohortData | null>(null);
    const [enrolled, setEnrolled] = useState(false);
    const [acknowledged, setAcknowledged] = useState(false);
    const [selectedCtf, setSelectedCtf] = useState<CtfData | null>(null);
    const [ctfMode, setCtfMode] = useState<'form' | 'join' | null>(null);
    const [teamName, setTeamName] = useState('');

    const minSwipeDistance = 50;

    // Fetch real leaderboard data
    useEffect(() => {
        const fetchLeaderboard = async () => {
            const result = await callApi('leaderboard.php');
            if (result.success && result.data?.leaderboard) {
                setLeaderboard(result.data.leaderboard);
            }
            setLoadingLeaderboard(false);
        };
        fetchLeaderboard();
    }, [callApi]);

    const handleCtfAction = useCallback((ctf: CtfData, mode: 'form' | 'join') => {
        setTeamName('');
        setCtfMode(mode);
        setSelectedCtf(ctf);
    }, []);

    const handleJoinUnit = useCallback((cohort: CohortData) => {
        setEnrolled(false);
        setAcknowledged(false);
        setSelectedCohort(cohort);
    }, []);

    const handleConfirmEnrol = () => {
        if (!acknowledged) return;
        setEnrolled(true);
    };

    const handleJoinLeague = (id: 'red' | 'blue' | 'purple') => {
        if (!isAuthenticated) {
            window.location.href = '/login?redirect=/league';
            return;
        }
        updateProfile({ preferredRole: id });
    };

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 30;
        const isRightSwipe = distance < -30;

        if (isLeftSwipe && currentIndex < teams.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else if (isRightSwipe && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const nextCard = () => {
        if (currentIndex < teams.length - 1) setCurrentIndex(prev => prev + 1);
    };

    const prevCard = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    return (
        <div 
            className={styles.page}
            style={{ 
                '--team-glow': teams[currentIndex].glow,
                '--team-color': teams[currentIndex].color,
                '--team-color-rgb': teams[currentIndex].color === '#e05252' ? '224, 82, 82' : teams[currentIndex].color === '#4a9eff' ? '74, 158, 255' : '155, 89, 245'
            } as React.CSSProperties}
        >
            <div className={styles.backgroundPattern} style={{ opacity: 0.05 }}></div>
            <div className={styles.scanLines} style={{ opacity: 0.01 }}></div>

            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.terminalHeader}>
                        <span className={styles.prompt}>admin@cyve:~$</span>
                        <span className={styles.typing}> select_specialization --all</span>
                    </div>
                    <h1>JOIN YOUR UNIT</h1>
                    <p>Compete. Collaborate. Dominate. Choose your specialization and find your unit.</p>
                </header>

                <div
                    className={styles.cardsWrapper}
                    onMouseMove={(e) => {
                        const target = e.currentTarget as HTMLDivElement;
                        const { left, width } = target.getBoundingClientRect();
                        const mouseX = e.clientX - left;
                        const percentage = mouseX / width;
                        if (percentage < 0.2 && currentIndex > 0) return; // Allow arrows to handle edges
                        if (percentage > 0.8 && currentIndex < 2) return;
                    }}
                    onMouseLeave={() => {}} // Keep selection
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <button 
                        className={`${styles.navBtn} ${styles.prevBtn}`} 
                        onClick={prevCard}
                        disabled={currentIndex === 0}
                        aria-label="Previous Team"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>

                    <div
                        className={styles.cardsContainer}
                        style={{
                            transform: `translateX(calc(-${currentIndex * 100 / 3}% + 33.33%))`,
                            transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
                        }}
                    >
                        {teams.map((team, index) => (
                            <div
                                key={team.id}
                                className={`${styles.cardWrapper} ${currentIndex === index ? styles.active : ''
                                    } ${currentIndex > index ? styles.left : ''} ${currentIndex < index ? styles.right : ''
                                    }`}
                            >
                                <motion.div
                                    className={styles.teamCard}
                                    whileHover={{ y: -10, rotateX: 2, rotateY: 5 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    style={{
                                        borderColor: currentIndex === index ? team.color : 'rgba(255, 255, 255, 0.1)',
                                        boxShadow: currentIndex === index ? `0 0 30px ${team.color}22` : 'none'
                                    }}
                                >
                                    {/* Card Visual */}
                                    <div
                                        className={styles.cardVisual}
                                        style={{ background: team.gradient }}
                                    >
                                        <div className={styles.glitchOverlay}></div>
                                        <div className={styles.circuitPattern} style={{ borderColor: team.color }}></div>
                                        <div className={styles.glowOrb} style={{ background: team.color }}></div>
                                        <div className={styles.teamSymbol} style={{ color: team.color }}>
                                            {team.id === 'red' && <RedTeamIcon />}
                                            {team.id === 'blue' && <BlueTeamIcon />}
                                            {team.id === 'purple' && <PurpleTeamIcon />}
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className={styles.cardContent}>
                                        <div className={styles.statusBadge}>ROLE:</div>
                                        <div className={styles.rolePill}>{team.role}</div>

                                        <h2 style={{ color: team.color }}>{team.name}</h2>
                                        <h3>{team.subtitle}</h3>
                                        <p className={styles.description}>{team.description}</p>

                                        <div className={styles.statsLabel}>KEY TASKS:</div>
                                        <div className={styles.statsGrid}>
                                            {team.tasks.map((task, i) => (
                                                <div key={i} className={styles.statItem} style={{ '--team-glow': team.color } as React.CSSProperties}>
                                                    <span>{task}</span>
                                                    <span className={styles.statValue}>→</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handleJoinLeague(team.id)}
                                            className={styles.exploreBtn}
                                            style={{
                                                borderColor: team.color,
                                                color: team.color,
                                                background: profile?.preferredRole === team.id ? `${team.color}22` : 'transparent'
                                            }}
                                        >
                                            {profile?.preferredRole === team.id ? 'UNIT ACTIVE' : `JOIN ${team.name.toUpperCase()} →`}
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>

                    <button 
                        className={`${styles.navBtn} ${styles.nextBtn}`} 
                        onClick={nextCard}
                        disabled={currentIndex === 2}
                        aria-label="Next Team"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>

                <div className={styles.navigation}>
                    {teams.map((team, index) => (
                        <button
                            key={team.id}
                            className={`${styles.navDot} ${currentIndex === index ? styles.activeDot : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            style={{
                                backgroundColor: currentIndex === index ? team.color : 'rgba(255, 255, 255, 0.3)'
                            }}
                        />
                    ))}
                </div>

                {/* ACTIVE COHORTS (FEAT-04) */}
                <div className={styles.cohortsSection}>
                    <h2 className={styles.sectionHeading}>ACTIVE COHORTS</h2>
                    <div className={styles.cohortsGrid}>
                        {COHORTS.map((cohort) => {
                            const fillPct = Math.round((cohort.operatives.total / cohort.operatives.slots) * 100);
                            return (
                                <div
                                    key={cohort.id}
                                    className={styles.cohortCard}
                                    style={{ background: `linear-gradient(160deg, ${cohort.teamColor}18 0%, #050505 60%)`, borderColor: `${cohort.teamColor}33`, '--cohort-color': cohort.teamColor } as React.CSSProperties}
                                >
                                    <div className={styles.cohortHeader}>
                                        <div>
                                            <h3>{cohort.batch} &mdash; {cohort.name}</h3>
                                            <span className={styles.cohortSub}>Started: {cohort.schedule.start}</span>
                                        </div>
                                        <div className={styles.statusBadge} style={{ color: cohort.teamColor, border: `1px solid ${cohort.teamColor}`, padding: '2px 8px', borderRadius: '4px' }}>
                                            {cohort.team.toUpperCase()}_TEAM
                                        </div>
                                    </div>
                                    <div className={styles.cohortStats}>
                                        <div className={styles.statValue}>{cohort.operatives.total} <span>OPERATIVES</span></div>
                                        <div className={styles.statValue}>{cohort.status === 'UPCOMING' ? '---' : `${fillPct}%`} <span>{cohort.status === 'UPCOMING' ? 'AVG_PROGRESS' : 'SLOTS_FILLED'}</span></div>
                                    </div>
                                    <div className={styles.progressBarBg}>
                                        <div className={styles.progressBarFill} style={{ width: `${fillPct}%`, background: cohort.teamColor }} />
                                    </div>
                                    <button
                                        className={styles.cohortBtn}
                                        style={{ borderColor: cohort.teamColor, color: cohort.teamColor }}
                                        onClick={() => handleJoinUnit(cohort)}
                                    >
                                        {cohort.btnLabel}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* OPERATION BOARD (FEAT-05) */}
                <div className={styles.operationBoardSection}>
                    <h2 className={styles.sectionHeading}>OPERATION BOARD</h2>
                    <div className={styles.ctfGrid}>
                        {CTF_OPERATIONS.map((ctf) => (
                            <div key={ctf.id} className={styles.ctfCard}
                                style={{ borderLeftColor: ctf.accentColor }}
                            >
                                <div className={styles.ctfHeader}>
                                    <h3>{ctf.name}</h3>
                                    <div className={styles.ctfDifficulty} style={{ backgroundColor: `${ctf.accentColor}22`, color: ctf.accentColor, borderColor: ctf.accentColor }}>{ctf.difficulty}</div>
                                </div>
                                <p className={styles.ctfDetails}>{ctf.shortDesc}</p>
                                <div className={styles.ctfMeta}>
                                    <span>📅 {ctf.dates}</span>
                                    <span>🌐 {ctf.platform}</span>
                                </div>
                                <div className={styles.ctfActions}>
                                    <button className={styles.btnPrimary} style={{ background: ctf.accentColor, color: '#000' }} onClick={() => handleCtfAction(ctf, 'form')}>FORM TEAM</button>
                                    <button className={styles.btnSecondary} style={{ borderColor: ctf.accentColor, color: ctf.accentColor }} onClick={() => handleCtfAction(ctf, 'join')}>JOIN EXISTING TEAM</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Leaderboard Section */}
                <div className={styles.leaderboardSection}>
                    <h2 className={styles.sectionHeading}>UNIT RANKINGS</h2>
                    <div className={styles.leaderboardContainer}>
                        {loadingLeaderboard ? (
                            <div className={styles.loader}>Accessing secure records...</div>
                        ) : leaderboard.length > 0 ? (
                            <div className={styles.leaderboardTable}>
                                {leaderboard.map((user, idx) => (
                                    <div key={user.id} className={`${styles.leaderboardRow} ${idx === 0 ? styles.topRank : ''}`} style={{ borderLeftColor: teams.find(t => t.id === user.team)?.color || '#2a2a2a' }}>
                                        <div className={`${styles.rank} ${idx === 0 ? styles.rank1 : ''}`}>#{idx + 1}</div>
                                        <div className={styles.userInfo}>
                                            <span className={styles.userName}>{user.display_name}</span>
                                            <span className={styles.userTeam} style={{ color: teams.find(t => t.id === user.team)?.color || '#888' }}>
                                                {user.team ? user.team.toUpperCase() : 'UNASSIGNED'}
                                            </span>
                                        </div>
                                        <div className={styles.userStats}>
                                            <span>{user.missions} MISSIONS</span>
                                            <span className={styles.score}>{user.score} XP</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.noData}>No data in current cycle.</div>
                        )}
                        <div className={styles.tableFooter}>
                            <span>V-0.4.2 // SECURITY PROTOCOL ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* COHORT DETAIL MODAL */}
            <AnimatePresence>
                {selectedCohort && (
                    <CohortDetailModal
                        cohort={selectedCohort}
                        enrolled={enrolled}
                        acknowledged={acknowledged}
                        onAcknowledge={() => setAcknowledged(v => !v)}
                        onConfirm={handleConfirmEnrol}
                        onClose={() => setSelectedCohort(null)}
                    />
                )}
                {selectedCtf && ctfMode && (
                    <CtfDetailModal
                        ctf={selectedCtf}
                        mode={ctfMode}
                        teamName={teamName}
                        onTeamNameChange={setTeamName}
                        onClose={() => setSelectedCtf(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Team Icons - Gold Standard Line Art
// ─── Cohort Detail Modal ────────────────────────────────────────────────────
// ─── CTF Detail Modal ──────────────────────────────────────────────────────
function CtfDetailModal({
    ctf, mode, teamName, onTeamNameChange, onClose
}: {
    ctf: CtfData;
    mode: 'form' | 'join';
    teamName: string;
    onTeamNameChange: (v: string) => void;
    onClose: () => void;
}) {
    const [submitted, setSubmitted] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'action'>(mode === 'form' ? 'info' : 'action');

    return (
        <motion.div
            className={styles.cohortModalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.cohortModal}
                style={{ '--cohort-color': ctf.accentColor, maxWidth: '900px' } as React.CSSProperties}
                initial={{ opacity: 0, y: 60, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 60, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.modalScanline} />

                {/* Header */}
                <div className={styles.modalHeader}>
                    <div className={styles.modalHeaderLeft}>
                        <span className={styles.modalBatch}>{ctf.platform} · {ctf.format}</span>
                        <h2 className={styles.modalTitle} style={{ color: ctf.accentColor }}>{ctf.name}</h2>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span className={styles.modalStatusBadge} style={{ background: `${ctf.accentColor}22`, color: ctf.accentColor, border: `1px solid ${ctf.accentColor}` }}>
                                {ctf.difficulty}
                            </span>
                            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>📅 {ctf.dates}</span>
                        </div>
                    </div>
                    <button className={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>
                </div>

                {/* Tabs */}
                <div className={styles.ctfTabs}>
                    <button
                        className={`${styles.ctfTab} ${activeTab === 'info' ? styles.ctfTabActive : ''}`}
                        style={activeTab === 'info' ? { color: ctf.accentColor, borderBottomColor: ctf.accentColor } : {}}
                        onClick={() => setActiveTab('info')}
                    >
                        COMPETITION INFO
                    </button>
                    <button
                        className={`${styles.ctfTab} ${activeTab === 'action' ? styles.ctfTabActive : ''}`}
                        style={activeTab === 'action' ? { color: ctf.accentColor, borderBottomColor: ctf.accentColor } : {}}
                        onClick={() => setActiveTab('action')}
                    >
                        {mode === 'form' ? 'FORM TEAM' : 'JOIN EXISTING TEAM'}
                    </button>
                </div>

                <div className={styles.modalBody} style={{ gridTemplateColumns: activeTab === 'info' ? '1fr 1fr' : '1fr' }}>
                    {activeTab === 'info' ? (
                        <>
                            {/* Left: Overview */}
                            <div className={styles.modalLeft}>
                                <section className={styles.modalSection}>
                                    <div className={styles.sectionLabel}>OVERVIEW</div>
                                    <div className={styles.orgPanel}>
                                        <p className={styles.orgDesc} style={{ marginBottom: 0 }}>{ctf.fullDesc}</p>
                                    </div>
                                </section>

                                <section className={styles.modalSection}>
                                    <div className={styles.sectionLabel}>LOGISTICS</div>
                                    <div className={styles.scheduleGrid}>
                                        <div className={styles.scheduleItem}>
                                            <span className={styles.scheduleKey}>DATES</span>
                                            <span className={styles.scheduleVal}>{ctf.dates}</span>
                                        </div>
                                        <div className={styles.scheduleItem}>
                                            <span className={styles.scheduleKey}>REG. DEADLINE</span>
                                            <span className={styles.scheduleVal}>{ctf.registrationDeadline}</span>
                                        </div>
                                        <div className={styles.scheduleItem}>
                                            <span className={styles.scheduleKey}>FORMAT</span>
                                            <span className={styles.scheduleVal}>{ctf.format}</span>
                                        </div>
                                        <div className={styles.scheduleItem}>
                                            <span className={styles.scheduleKey}>TEAM SIZE</span>
                                            <span className={styles.scheduleVal}>{ctf.teamSize}</span>
                                        </div>
                                    </div>
                                </section>

                                <section className={styles.modalSection}>
                                    <div className={styles.sectionLabel}>ELIGIBILITY</div>
                                    <div className={styles.orgPanel}>
                                        <p className={styles.orgDesc} style={{ marginBottom: 0 }}>{ctf.eligibility}</p>
                                    </div>
                                </section>
                            </div>

                            {/* Right: Categories & Prizes */}
                            <div className={styles.modalRight}>
                                <section className={styles.modalSection}>
                                    <div className={styles.sectionLabel}>CHALLENGE CATEGORIES</div>
                                    <ul className={styles.reqList}>
                                        {ctf.categories.map((cat, i) => (
                                            <li key={i} className={styles.reqItem}>
                                                <span style={{ color: ctf.accentColor }}>◈</span> {cat}
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section className={styles.modalSection}>
                                    <div className={styles.sectionLabel}>PRIZES & REWARDS</div>
                                    <ol className={styles.curriculumList}>
                                        {ctf.prizes.map((prize, i) => (
                                            <li key={i} className={styles.curriculumItem} style={{ '--cohort-color': ctf.accentColor } as React.CSSProperties}>
                                                <span className={styles.curriculumNum} style={{ color: ctf.accentColor }}>
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                <span>{prize}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </section>

                                <section className={styles.modalSection}>
                                    <div className={styles.sectionLabel}>EXTERNAL LINK</div>
                                    <a
                                        href={ctf.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.ctfExternalLink}
                                        style={{ color: ctf.accentColor, borderColor: ctf.accentColor }}
                                    >
                                        🔗 Visit Official Website →
                                    </a>
                                </section>
                            </div>
                        </>
                    ) : (
                        /* Action Panel */
                        <div className={styles.modalLeft} style={{ borderRight: 'none', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                            {submitted ? (
                                <div className={styles.enrolSuccess} style={{ borderColor: ctf.accentColor, marginTop: '1rem' }}>
                                    <div className={styles.enrolSuccessIcon} style={{ color: ctf.accentColor }}>✓</div>
                                    <div>
                                        <div className={styles.enrolSuccessTitle}>
                                            {mode === 'form' ? 'TEAM_FORMATION_REQUESTED' : 'JOIN_REQUEST_SUBMITTED'}
                                        </div>
                                        <div className={styles.enrolSuccessSub}>
                                            {mode === 'form'
                                                ? `Team "${teamName}" has been registered for ${ctf.name}. Confirmation will be sent to your registered comms.`
                                                : `Your join request has been submitted. The team captain will review and approve your application.`}
                                        </div>
                                    </div>
                                </div>
                            ) : mode === 'form' ? (
                                /* FORM TEAM */
                                <section className={styles.modalSection}>
                                    <div className={styles.sectionLabel}>CREATE A NEW TEAM</div>
                                    <div className={styles.orgPanel} style={{ marginBottom: '1rem' }}>
                                        <p className={styles.orgDesc}>Register a new team for <strong style={{ color: ctf.accentColor }}>{ctf.name}</strong>. As team captain, you can invite other CYVE operatives to join after registration.</p>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>TEAM DESIGNATION</label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            style={{ borderColor: `${ctf.accentColor}55` }}
                                            placeholder="e.g. CYVE_Delta_Force"
                                            value={teamName}
                                            onChange={(e) => onTeamNameChange(e.target.value)}
                                            maxLength={30}
                                        />
                                        <span className={styles.formHint}>{teamName.length}/30 chars. Alphanumeric and underscores only.</span>
                                    </div>
                                    <div className={styles.scheduleGrid} style={{ marginTop: '1rem' }}>
                                        <div className={styles.scheduleItem}>
                                            <span className={styles.scheduleKey}>COMPETITION</span>
                                            <span className={styles.scheduleVal} style={{ fontSize: '0.75rem' }}>{ctf.name}</span>
                                        </div>
                                        <div className={styles.scheduleItem}>
                                            <span className={styles.scheduleKey}>MAX TEAM SIZE</span>
                                            <span className={styles.scheduleVal}>{ctf.teamSize}</span>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.enrolBtn}
                                        style={{
                                            marginTop: '1.5rem',
                                            background: teamName.trim() ? ctf.accentColor : 'transparent',
                                            borderColor: ctf.accentColor,
                                            color: teamName.trim() ? '#000' : ctf.accentColor,
                                            opacity: teamName.trim() ? 1 : 0.5,
                                            cursor: teamName.trim() ? 'pointer' : 'not-allowed'
                                        }}
                                        disabled={!teamName.trim()}
                                        onClick={() => setSubmitted(true)}
                                    >
                                        REGISTER TEAM →
                                    </button>
                                </section>
                            ) : (
                                /* JOIN EXISTING TEAM */
                                <section className={styles.modalSection}>
                                    <div className={styles.sectionLabel}>AVAILABLE TEAMS</div>
                                    <div className={styles.orgPanel} style={{ marginBottom: '1rem' }}>
                                        <p className={styles.orgDesc}>Select an open team to request membership. The team captain will review your application.</p>
                                    </div>
                                    <div className={styles.rosterList}>
                                        {ctf.existingTeams.map((team, i) => (
                                            <div key={i} className={styles.ctfTeamRow} style={{ '--cohort-color': ctf.accentColor } as React.CSSProperties}>
                                                <div>
                                                    <div className={styles.ctfTeamName}>{team.name}</div>
                                                    <div className={styles.ctfTeamSlots}>
                                                        <span style={{ color: ctf.accentColor }}>{team.members}</span>/{team.members + team.slots} members
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className={styles.progressBarBg} style={{ width: '80px', marginBottom: '0.4rem' }}>
                                                        <div className={styles.progressBarFill} style={{ width: `${Math.round(team.members / (team.members + team.slots) * 100)}%`, background: ctf.accentColor }} />
                                                    </div>
                                                    <button
                                                        className={styles.ctfJoinTeamBtn}
                                                        style={{ borderColor: ctf.accentColor, color: ctf.accentColor }}
                                                        disabled={team.slots === 0}
                                                        onClick={() => setSubmitted(true)}
                                                    >
                                                        {team.slots === 0 ? 'FULL' : 'REQUEST →'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

function CohortDetailModal({
    cohort,
    enrolled,
    acknowledged,
    onAcknowledge,
    onConfirm,
    onClose,
}: {
    cohort: CohortData;
    enrolled: boolean;
    acknowledged: boolean;
    onAcknowledge: () => void;
    onConfirm: () => void;
    onClose: () => void;
}) {
    const fillPct = Math.round((cohort.operatives.total / cohort.operatives.slots) * 100);
    const slotsFree = cohort.operatives.slots - cohort.operatives.total;

    return (
        <motion.div
            className={styles.cohortModalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.cohortModal}
                style={{ '--cohort-color': cohort.teamColor } as React.CSSProperties}
                initial={{ opacity: 0, y: 60, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 60, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Scanline effect */}
                <div className={styles.modalScanline} />

                {/* Header */}
                <div className={styles.modalHeader}>
                    <div className={styles.modalHeaderLeft}>
                        <span className={styles.modalBatch}>{cohort.batch}</span>
                        <h2 className={styles.modalTitle} style={{ color: cohort.teamColor }}>{cohort.name}</h2>
                        <span className={styles.modalStatusBadge} style={{ background: `${cohort.teamColor}22`, color: cohort.teamColor, border: `1px solid ${cohort.teamColor}` }}>
                            {cohort.status}
                        </span>
                    </div>
                    <button className={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.modalLeft}>
                        {/* Organization */}
                        <section className={styles.modalSection}>
                            <div className={styles.sectionLabel}>ORGANIZATION</div>
                            <div className={styles.orgPanel}>
                                <div className={styles.orgName}>{cohort.org.name}</div>
                                <p className={styles.orgDesc}>{cohort.org.description}</p>
                                <div className={styles.orgMeta}>
                                    <span>📅 Est. {cohort.org.founded}</span>
                                </div>
                            </div>
                        </section>

                        {/* Mentor */}
                        <section className={styles.modalSection}>
                            <div className={styles.sectionLabel}>COMMANDING OFFICER</div>
                            <div className={styles.mentorCard}>
                                <div className={styles.mentorAvatar} style={{ background: `${cohort.teamColor}22`, borderColor: cohort.teamColor }}>
                                    {cohort.mentor.name.charAt(0)}
                                </div>
                                <div>
                                    <div className={styles.mentorName}>{cohort.mentor.name}</div>
                                    <div className={styles.mentorRole}>{cohort.mentor.role}</div>
                                </div>
                            </div>
                        </section>

                        {/* Schedule */}
                        <section className={styles.modalSection}>
                            <div className={styles.sectionLabel}>DEPLOYMENT SCHEDULE</div>
                            <div className={styles.scheduleGrid}>
                                <div className={styles.scheduleItem}>
                                    <span className={styles.scheduleKey}>START DATE</span>
                                    <span className={styles.scheduleVal}>{cohort.schedule.start}</span>
                                </div>
                                <div className={styles.scheduleItem}>
                                    <span className={styles.scheduleKey}>END DATE</span>
                                    <span className={styles.scheduleVal}>{cohort.schedule.end}</span>
                                </div>
                                <div className={styles.scheduleItem}>
                                    <span className={styles.scheduleKey}>CADENCE</span>
                                    <span className={styles.scheduleVal}>{cohort.schedule.cadence}</span>
                                </div>
                                <div className={styles.scheduleItem}>
                                    <span className={styles.scheduleKey}>TIME SLOT</span>
                                    <span className={styles.scheduleVal}>{cohort.schedule.time}</span>
                                </div>
                            </div>
                        </section>

                        {/* Requirements */}
                        <section className={styles.modalSection}>
                            <div className={styles.sectionLabel}>PREREQUISITES</div>
                            <ul className={styles.reqList}>
                                {cohort.requirements.map((r, i) => (
                                    <li key={i} className={styles.reqItem}>
                                        <span style={{ color: cohort.teamColor }}>◈</span> {r}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    <div className={styles.modalRight}>
                        {/* Curriculum */}
                        <section className={styles.modalSection}>
                            <div className={styles.sectionLabel}>CURRICULUM</div>
                            <ol className={styles.curriculumList}>
                                {cohort.curriculum.map((module, i) => (
                                    <li key={i} className={styles.curriculumItem} style={{ '--cohort-color': cohort.teamColor } as React.CSSProperties}>
                                        <span className={styles.curriculumNum} style={{ color: cohort.teamColor }}>
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span>{module}</span>
                                    </li>
                                ))}
                            </ol>
                        </section>

                        {/* Operative Roster */}
                        <section className={styles.modalSection}>
                            <div className={styles.sectionLabel}>OPERATIVE ROSTER</div>
                            <div className={styles.rosterMeta}>
                                <span><strong style={{ color: cohort.teamColor }}>{cohort.operatives.total}</strong> / {cohort.operatives.slots} slots filled</span>
                                <span style={{ color: slotsFree > 0 ? '#4caf50' : '#e05252' }}>{slotsFree > 0 ? `${slotsFree} slots remaining` : 'FULL'}</span>
                            </div>
                            <div className={styles.progressBarBg} style={{ marginBottom: '1rem' }}>
                                <div className={styles.progressBarFill} style={{ width: `${fillPct}%`, background: cohort.teamColor }} />
                            </div>
                            <div className={styles.rosterList}>
                                {cohort.operatives.members.map((m, i) => (
                                    <div key={i} className={styles.rosterRow}>
                                        <span className={styles.rosterName}>{m.name}</span>
                                        <span className={styles.rosterRank} style={{ color: cohort.teamColor }}>{m.rank}</span>
                                    </div>
                                ))}
                                {cohort.operatives.total > cohort.operatives.members.length && (
                                    <div className={styles.rosterMore}>
                                        +{cohort.operatives.total - cohort.operatives.members.length} more operatives
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Enrol CTA */}
                        <section className={styles.enrolPanel}>
                            {enrolled ? (
                                <div className={styles.enrolSuccess} style={{ borderColor: cohort.teamColor }}>
                                    <div className={styles.enrolSuccessIcon} style={{ color: cohort.teamColor }}>✓</div>
                                    <div>
                                        <div className={styles.enrolSuccessTitle}>ENROLMENT_CONFIRMED</div>
                                        <div className={styles.enrolSuccessSub}>Welcome to {cohort.name}. Reporting instructions will be dispatched to your registered comms.</div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <label className={styles.ackLabel}>
                                        <input type="checkbox" checked={acknowledged} onChange={onAcknowledge} className={styles.ackCheckbox} />
                                        <span>I acknowledge the prerequisites and commit to the {cohort.schedule.cadence.toLowerCase()} schedule.</span>
                                    </label>
                                    <button
                                        className={styles.enrolBtn}
                                        style={{
                                            background: acknowledged ? cohort.teamColor : 'transparent',
                                            borderColor: cohort.teamColor,
                                            color: acknowledged ? '#000' : cohort.teamColor,
                                            opacity: acknowledged ? 1 : 0.5,
                                            cursor: acknowledged ? 'pointer' : 'not-allowed'
                                        }}
                                        onClick={onConfirm}
                                        disabled={!acknowledged}
                                    >
                                        CONFIRM_ENROLMENT →
                                    </button>
                                </>
                            )}
                        </section>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function RedTeamIcon() {
    return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ opacity: 0.6 }}>
            <circle cx="60" cy="60" r="40" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <circle cx="60" cy="60" r="20" stroke="currentColor" strokeWidth="1" />
            <path d="M60 10V110M10 60H110" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <circle cx="60" cy="60" r="2" fill="currentColor" />
        </svg>
    );
}

function BlueTeamIcon() {
    return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ opacity: 0.6 }}>
            <path d="M60 20L100 35V65C100 85 85 100 60 110C35 100 20 85 20 65V35L60 20Z" stroke="currentColor" strokeWidth="2" />
            <circle cx="60" cy="60" r="5" fill="currentColor" />
        </svg>
    );
}

function PurpleTeamIcon() {
    return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ opacity: 0.6 }}>
            <circle cx="45" cy="60" r="25" stroke="currentColor" strokeWidth="2" />
            <circle cx="75" cy="60" r="25" stroke="currentColor" strokeWidth="2" />
            <circle cx="60" cy="60" r="3" fill="currentColor" />
        </svg>
    );
}
