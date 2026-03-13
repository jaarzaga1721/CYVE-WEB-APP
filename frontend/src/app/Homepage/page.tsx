'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRoadmap } from '@/context/RoadmapContext';
import { useCalendar } from '@/context/CalendarContext';
import { useProfile } from '@/context/ProfileContext';
import { useStreak } from '@/context/StreakContext';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/context/ToastContext';
import IDCard from '@/app/Homepage/components/IDCard';
import CipherMentor from '@/app/Homepage/components/CipherMentor';
import styles from './page.module.css';
import {
    RoadmapIcon,
    CalendarIcon,
    ShieldIcon,
    UserIcon,
    TargetIcon,
    CheckCircleIcon,
    LibraryIcon,
    GraduationIcon
} from '@/app/Homepage/components/Icons';

// Career Path Database
const careerDatabase = [
    {
        title: "Penetration Tester",
        team: "Red Team",
        description: "Focuses on identifying and exploiting vulnerabilities in systems, networks, and applications to help organizations improve their cybersecurity posture.",
        skills: ["Ethical Hacking", "Python/Bash Scripting", "Network Security", "Metasploit", "Web App Security"],
        certs: ["OSCP", "CEH", "GPEN", "eJPT"],
        learningPath: "Learn networking basics -> Master Linux & Scripting -> Study common vulnerabilities (OWASP) -> Get OSCP certification."
    },
    {
        title: "Ethical Hacker",
        team: "Red Team",
        description: "Uses the same techniques as malicious hackers to find and patch cybersecurity holes, working legally to protect organizations.",
        skills: ["Vulnerability Assessment", "Cryptography", "Reverse Engineering", "Social Engineering"],
        certs: ["CEH", "CompTIA PenTest+", "GIAC Technical Certs"],
        learningPath: "Start with CompTIA Security+ -> Learn penetration testing methodologies -> Practice on platforms like TryHackMe/HackTheBox."
    },
    {
        title: "SOC Analyst",
        team: "Blue Team",
        description: "Monitors organization's infrastructure to detect and respond to cybersecurity threats in real-time.",
        skills: ["SIEM (Splunk/ELK)", "Incident Response", "Log Analysis", "Threat Detection", "Traffic Analysis", "Cybersecurity"],
        certs: ["CySA+", "GCIH", "BTL1"],
        learningPath: "Understand TCP/IP and networking -> Learn SIEM tools -> Study incident response frameworks -> Achieve CySA+."
    },
    {
        title: "Security Analyst",
        team: "Blue Team",
        description: "Analyzes security policies and technical controls to ensure an organization remains secure and compliant with standards.",
        skills: ["Risk Management", "Compliance Standards", "Firewall Management", "IAM", "Data Protection"],
        certs: ["CompTIA Security+", "SSCP", "GSEC"],
        learningPath: "Build strong IT foundation -> Master Security+ topics -> Specialize in Governance/Risk/Compliance or Technical analysis."
    },
    {
        title: "Digital Forensics",
        team: "Blue Team",
        description: "Investigates digital evidence after a security breach to understand the 'how' and 'who' behind a cybercrime.",
        skills: ["Evidence Collection", "File System Analysis", "Memory Forensics", "Malware Analysis", "Chain of Custody"],
        certs: ["GCFE", "GCFA", "CHFI", "EnCE"],
        learningPath: "Learn computer hardware & file systems -> Study forensic tools (Autopsy/FTK) -> Understand legal procedures for digital evidence."
    },
    {
        title: "Threat Intelligence Analyst",
        team: "Purple Team",
        description: "Gathers and analyzes information about current and emerging cyber threats to help organizations proactively defend themselves.",
        skills: ["OSINT", "Dark Web Monitoring", "Threat Modeling", "Indicators of Compromise (IoCs)", "Data Analysis"],
        certs: ["GCTI", "CTIA"],
        learningPath: "Learn about the cyber threat landscape -> Master OSINT techniques -> Study the Diamond Model and Lockheed Martin Kill Chain."
    },
    {
        title: "Cloud Security Specialist",
        team: "Blue/Purple Team",
        description: "Focuses on securing cloud infrastructure and services (AWS, Azure, GCP) from threats and misconfigurations.",
        skills: ["Cloud Architecture", "Identity & Access Management (IAM)", "DevSecOps", "Cloud Compliance", "Serverless Security"],
        certs: ["CCSP", "AWS Certified Security Specialty", "Azure Security Engineer"],
        learningPath: "Get a baseline cloud certification (Cloud Practitioner) -> Learn cloud-native security tools -> Implement DevSecOps pipelines."
    }
];

import { CyberTerminal } from '@/app/Homepage/components/CyberTerminal';

export default function Home() {
    const { isAuthenticated, user } = useAuth();
    const { getProgress } = useRoadmap();
    const { tasks } = useCalendar();

    if (isAuthenticated) {
        return <LoggedInHome user={user} progress={getProgress()} upcomingTasks={tasks} />;
    }

    // Show landing page for non-authenticated users
    return <LoggedOutHome />;
}

function LoggedOutHome() {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<typeof careerDatabase>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedCareer, setSelectedCareer] = useState<typeof careerDatabase[0] | null>(null);
    const [showFullSite, setShowFullSite] = useState(false);
    const { showToast } = useToast();
    const resultsRef = useRef<HTMLDivElement>(null);

    const handleSearch = (query: string) => {
        const q = query.toLowerCase().trim();
        if (q.length > 0) {
            const matches = careerDatabase.filter(career =>
                career.title.toLowerCase().includes(q) ||
                career.team.toLowerCase().includes(q) ||
                career.description.toLowerCase().includes(q) ||
                career.skills.some(skill => skill.toLowerCase().includes(q))
            );
            setSuggestions(matches);
            setShowSuggestions(matches.length > 0);
            
            if (matches.length === 0) {
                showToast(`No matches found for "${query}". Access granted to general archives.`, 'info');
            }
            
            // Reveal site and scroll
            setShowFullSite(true);
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (career: typeof careerDatabase[0]) => {
        setSelectedCareer(career);
        setSearchQuery(career.title);
        setShowSuggestions(false);
    };

    const handleCloseDetails = () => {
        setSelectedCareer(null);
    };

    return (
        <div className={`${styles.page} ${!showFullSite ? styles.terminalOnly : ''}`}>
            {/* Hero Section - Cyber-Terminal First */}
            <section className={styles.heroFull}>
                {!showFullSite && (
                    <div className={styles.initialPrompt}>
                        <h2>CYVE_OS // TACTICAL DOMINANCE</h2>
                        <p>AUTHENTICATE_TO_PROCEED</p>
                    </div>
                )}
                
                <div className={styles.terminalWrapper}>
                    <CyberTerminal onSearch={handleSearch} />
                    
                    {showSuggestions && (
                        <div className={`${styles.searchOverlay} search-container`}>
                            <div className={styles.terminalSuggestions}>
                                <div className={styles.suggestionTitle}>MATCHES_FOUND:</div>
                                {suggestions.map((career, index) => (
                                    <div 
                                        key={index}
                                        className={styles.terminalSuggestionItem}
                                        onClick={() => handleSuggestionClick(career)}
                                    >
                                        <span className={styles.matchIndex}>[0{index + 1}]</span> {career.title} <span className={styles.matchTeam}>// {career.team}</span>
                                    </div>
                                ))}
                                <button className={styles.closeOverlay} onClick={() => setShowSuggestions(false)}>CLOSE_X</button>
                            </div>
                        </div>
                    )}
                </div>

                {!showFullSite && <div className={styles.scrollHint}>ESTABLISH_CONNECTION</div>}
            </section>

            <div ref={resultsRef} className={`${styles.siteContent} ${showFullSite ? styles.visible : ''}`}>
                {/* Career Details Section */}
                {selectedCareer && (
                    <div className={styles.careerDetailsSection}>
                        <button className={styles.closeDetails} onClick={handleCloseDetails}>
                            ×
                        </button>
                        
                        <div className={styles.detailsHeader}>
                            <div className={styles.detailsTitleRow}>
                                <h2 className={styles.detailsTitle}>{selectedCareer.title}</h2>
                                <span className={`${styles.teamBadge} ${
                                    selectedCareer.team === 'Red Team' ? styles.teamRed : 
                                    selectedCareer.team === 'Blue Team' ? styles.teamBlue : 
                                    styles.teamPurple
                                }`}>
                                    {selectedCareer.team}
                                </span>
                            </div>
                            <p className={styles.detailsDescription}>{selectedCareer.description}</p>
                        </div>

                        <div className={styles.detailsGrid}>
                            <div className={styles.detailsBlock}>
                                <h3><LibraryIcon width={18} height={18} /> Required Skills</h3>
                                <ul className={styles.detailsList}>
                                    {selectedCareer.skills.map((skill, index) => (
                                        <li key={index} className={styles.detailsListItem}>
                                            <span className={styles.bullet}>//</span> {skill}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.detailsBlock}>
                                <h3><GraduationIcon width={18} height={18} /> Suggested Certifications</h3>
                                <ul className={styles.detailsList}>
                                    {selectedCareer.certs.map((cert, index) => (
                                        <li key={index} className={styles.detailsListItem}>
                                            <span className={styles.bullet}>[!]</span> {cert}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className={styles.learningPathBlock}>
                            <h3><RoadmapIcon width={18} height={18} /> Recommended Learning Path</h3>
                            <p className={styles.learningPathText}>{selectedCareer.learningPath}</p>
                        </div>
                    </div>
                )}

                {/* Sub-Hero Section */}
                <section className={styles.subHero}>
                    <div className={styles.subHeroLeft}>
                        <div className={styles.triangleGraphic}></div>
                        <div className={styles.buildText}>
                            <span>build,</span>
                            <span>your,</span>
                            <span>future</span>
                        </div>
                    </div>
                    <div className={styles.subHeroRight}>
                        <div className={styles.subHeroTag}>MISSION_BRIEF</div>
                        <h2 className={styles.subHeroTitle}>CHOOSE YOUR PATH. EXECUTE THE MISSION.</h2>
                        <p className={styles.subHeroDescription}>
                            The Philippines needs battle-ready cyber operatives. Whether you are breaking into
                            red team offense, locking down defenses as blue team, or bridging both as purple —
                            CYVE gives you the structured roadmap, the labs, and the intelligence you need to deploy.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                            <Link href="/login" className={styles.ctaPrimary}>ACCESS_PLATFORM →</Link>
                            <Link href="/contact" className={styles.ctaSecondary}>LEARN_MORE</Link>
                        </div>
                    </div>
                </section>

                {/* Team Sections */}
                <section className={styles.teamSections}>
                    {/* Red Team */}
                    <div className={styles.teamCard}>
                        <Link href="/league/red-team" className={styles.teamLink}>
                            <div className={styles.teamBg} style={{ backgroundImage: "url('/design-specs/images/62_6.png')" }}></div>
                            <div className={styles.teamContent}>
                                <div className={styles.teamFocalWrapper}>
                                    <img src="/design-specs/images/red_team_cyberpunk_1772895735770.png" alt="Red Team" className={styles.teamFocalImg} />
                                </div>
                                <div className={styles.teamLabels}>
                                    <span className={styles.teamLabelLeft}>RED_TEAM</span>
                                    <span className={styles.teamLabelRight}>OFFENSIVE_SECURITY</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Blue Team */}
                    <div className={styles.teamCard}>
                        <Link href="/league/blue-team" className={styles.teamLink}>
                            <div className={styles.teamBg} style={{ backgroundImage: "url('/design-specs/images/62_6.png')" }}></div>
                            <div className={styles.teamContent}>
                                <div className={styles.teamFocalWrapper}>
                                    <img src="/design-specs/images/blue_team_cyberpunk_1772895780162.png" alt="Blue Team" className={styles.teamFocalImg} />
                                </div>
                                <div className={styles.teamLabels}>
                                    <span className={styles.teamLabelLeft}>BLUE_TEAM</span>
                                    <span className={styles.teamLabelRight}>DEFENSIVE_SECURITY</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Purple Team */}
                    <div className={styles.teamCard}>
                        <Link href="/league/purple-team" className={styles.teamLink}>
                            <div className={styles.teamBg} style={{ backgroundImage: "url('/design-specs/images/62_6.png')" }}></div>
                            <div className={styles.teamContent}>
                                <div className={styles.teamFocalWrapper}>
                                    <img src="/design-specs/images/purple_team_cyberpunk_1772895803036.png" alt="Purple Team" className={styles.teamFocalImg} />
                                </div>
                                <div className={styles.teamLabels}>
                                    <span className={styles.teamLabelLeft}>PURPLE_TEAM</span>
                                    <span className={styles.teamLabelRight}>TACTICAL_COLLABORATION</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

function LoggedInHome({ user, progress, upcomingTasks }: any) {
    const { profile } = useProfile();
    const { streak, checkIn } = useStreak();
    const [cipherOpen, setCipherOpen] = useState(false);
    const today = new Date();
    const todayTasks = upcomingTasks.filter((task: any) =>
        task.date === today.toISOString().split('T')[0]
    );

    const displayName = user?.display_name || (user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : 'Agent');

    const todayStr = today.toISOString().split('T')[0];
    const alreadyCheckedIn = streak.lastActiveDate === todayStr;

    // XP progress to next rank
    const RANK_THRESHOLDS = [0, 200, 600, 1200, 2500, 5000];
    const RANK_NAMES = ['RECRUIT', 'OPERATIVE', 'SPECIALIST', 'AGENT', 'ELITE', 'PHANTOM'];
    const rankIdx = RANK_NAMES.indexOf(streak.rank);
    const nextRankXP = RANK_THRESHOLDS[Math.min(rankIdx + 1, RANK_THRESHOLDS.length - 1)];
    const currentRankXP = RANK_THRESHOLDS[rankIdx] || 0;
    const xpPct = rankIdx >= RANK_NAMES.length - 1 ? 100 : Math.min(100, ((streak.seasonXP - currentRankXP) / (nextRankXP - currentRankXP)) * 100);

    return (
        <div className={styles.page}>
            <section className={styles.dashboard}>
                <div className={styles.dashboardHeader}>
                    <div>
                        <h1 className={styles.welcomeTitle}>ACCESS GRANTED: {displayName}</h1>
                        <p className={styles.welcomeSubtitle}>SYSTEMS_REACTIVE // SESSION_ESTABLISHED</p>
                    </div>
                    <IDCard
                        name={profile.name || displayName}
                        email={user?.email || ''}
                        role={profile.preferredRole}
                        progress={progress}
                    />
                </div>

                {/* SEASON STREAK BANNER */}
                <div className={styles.streakBanner}>
                    <div className={styles.streakLeft}>
                        <span className={styles.streakFlame}>🔥</span>
                        <div>
                            <div className={styles.streakCount}>{streak.currentStreak} DAY STREAK</div>
                            <div className={styles.streakSub}>SEASON {streak.season} // RANK: <span style={{ color: 'var(--color-gold)' }}>{streak.rank}</span></div>
                        </div>
                    </div>
                    <div className={styles.streakMiddle}>
                        <div className={styles.xpLabel}>{streak.seasonXP} XP{rankIdx < RANK_NAMES.length - 1 ? ` / ${nextRankXP} XP` : ' // MAX RANK'}</div>
                        <div className={styles.xpBar}><div className={styles.xpFill} style={{ width: `${xpPct}%` }} /></div>
                    </div>
                    {!alreadyCheckedIn ? (
                        <button className={styles.checkInBtn} onClick={checkIn}>
                            DAILY_CHECK_IN → +50 XP
                        </button>
                    ) : (
                        <span className={styles.checkedIn}>✓ CHECKED_IN</span>
                    )}
                </div>

                {/* OPS CONSOLE */}
                <div className={styles.opsConsole}>
                    <h2 className={styles.sectionHeading}>OPS_CONSOLE</h2>
                    <CyberTerminal user={user} progress={progress} tasks={upcomingTasks} />
                </div>

                <div className={styles.statsGrid}>
                    <div className={`${styles.statCard} ${styles.progressCard}`}>
                        <div className={styles.statIcon}>
                            <TargetIcon width={40} height={40} color="#f5be1e" />
                        </div>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>MISSION_COMPLETION</p>
                            {progress === 0 ? (
                                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '2px solid #f5a623' }}>
                                    <p style={{ margin: '0 0 0.5rem', color: '#fff', fontSize: '0.9rem' }}>STATUS: IDLE</p>
                                    <Link href="/roadmap" style={{ color: '#f5a623', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>START MISSION →</Link>
                                </div>
                            ) : (
                                <>
                                    <p className={styles.statValue}>{progress}%</p>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <CheckCircleIcon width={40} height={40} color="#f5be1e" />
                        </div>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>INTEL_OVERVIEW</p>
                            <p className={styles.statValue}>{todayTasks.length}</p>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <LibraryIcon width={40} height={40} color="#f5be1e" />
                        </div>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>Total Tasks</p>
                            <p className={styles.statValue}>{upcomingTasks.length}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.quickActions}>
                    <h2 className={styles.sectionHeading}>Quick Actions</h2>
                    <div className={styles.actionGrid}>
                        <Link href="/roadmap" className={`${styles.actionCard} ${styles.actionCardPrimary}`}>
                            <span className={styles.actionIcon}><RoadmapIcon width={32} height={32} color="#000000" /></span>
                            <span className={styles.actionText}>Continue Roadmap</span>
                        </Link>
                        <Link href="/calendar" className={styles.actionCard}>
                            <span className={styles.actionIcon}><CalendarIcon width={32} height={32} color="#f5be1e" /></span>
                            <span className={styles.actionText}>View Calendar</span>
                        </Link>
                        <Link href="/labs" className={styles.actionCard}>
                            <span className={styles.actionIcon}><ShieldIcon width={32} height={32} color="#f5be1e" /></span>
                            <span className={styles.actionText}>Mission Labs</span>
                        </Link>
                        <Link href="/jobs" className={styles.actionCard}>
                            <span className={styles.actionIcon}><UserIcon width={32} height={32} color="#f5be1e" /></span>
                            <span className={styles.actionText}>Job Board</span>
                        </Link>
                    </div>
                </div>

                {upcomingTasks.length > 0 && (
                    <div className={styles.upcomingSection}>
                        <h2 className={styles.sectionHeading}>ACTIVE_INTEL_FEED</h2>
                        <div className={styles.tasksList}>
                            {upcomingTasks.map((task: any) => (
                                <div key={task.id} className={styles.taskItem}>
                                    <div className={styles.taskDate}>
                                        {new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className={styles.taskDetails}>
                                        <h4>{task.title}</h4>
                                        <p>{task.description}</p>
                                    </div>
                                    <div className={styles.taskStatus}>
                                        {task.completed ? (
                                            <span className="badge badge-blue">Completed</span>
                                        ) : (
                                            <span className="badge badge-outline">Pending</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* CIPHER AI FAB */}
            <button className={styles.cipherFab} onClick={() => setCipherOpen(true)} title="Ask CIPHER_AI">
                <span className={styles.fabIcon}>⬡</span>
                <span className={styles.fabLabel}>CIPHER</span>
                <div className={styles.fabPulse} />
            </button>
            <CipherMentor isOpen={cipherOpen} onClose={() => setCipherOpen(false)} />
        </div>
    );
}
