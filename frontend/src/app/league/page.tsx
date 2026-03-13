'use client';

import { useState, useEffect } from 'react';
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

export default function LeaguePage() {
    const [currentIndex, setCurrentIndex] = useState(1); // Start with Purple in center
    const { profile, updateProfile } = useProfile();
    const { isAuthenticated } = useAuth();
    const { callApi, loading: apiLoading } = useApi();
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

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
                        <div className={styles.cohortCard} style={{ background: 'linear-gradient(160deg, #2a0808 0%, #1a0505 40%, #0d0303 100%)', borderColor: 'rgba(224, 82, 82, 0.2)' }}>
                            <div className={styles.cohortHeader}>
                                <div>
                                    <h3>BATCH 01 — PH ALPHA</h3>
                                    <span className={styles.cohortSub}>Started: Jan 2026</span>
                                </div>
                                <div className={styles.statusBadge} style={{ color: '#e05252', borderColor: '#e05252', padding: '2px 8px', border: '1px solid', borderRadius: '4px' }}>RED_TEAM</div>
                            </div>
                            <div className={styles.cohortStats}>
                                <div className={styles.statValue}>42 <span>OPERATIVES</span></div>
                                <div className={styles.statValue}>68% <span>AVG_PROGRESS</span></div>
                            </div>
                            <div className={styles.progressBarBg}><div className={styles.progressBarFill} style={{ width: '68%', background: '#e05252' }}></div></div>
                            <button className={styles.cohortBtn}>JOIN UNIT</button>
                        </div>
                        
                        <div className={styles.cohortCard} style={{ background: 'linear-gradient(160deg, #081428 0%, #050d1a 40%, #030810 100%)', borderColor: 'rgba(74, 158, 255, 0.2)' }}>
                            <div className={styles.cohortHeader}>
                                <div>
                                    <h3>BATCH 02 — PH BRAVO</h3>
                                    <span className={styles.cohortSub}>Started: Feb 2026</span>
                                </div>
                                <div className={styles.statusBadge} style={{ color: '#4a9eff', borderColor: '#4a9eff', padding: '2px 8px', border: '1px solid', borderRadius: '4px' }}>BLUE_TEAM</div>
                            </div>
                            <div className={styles.cohortStats}>
                                <div className={styles.statValue}>55 <span>OPERATIVES</span></div>
                                <div className={styles.statValue}>31% <span>AVG_PROGRESS</span></div>
                            </div>
                            <div className={styles.progressBarBg}><div className={styles.progressBarFill} style={{ width: '31%', background: '#4a9eff' }}></div></div>
                            <button className={styles.cohortBtn}>JOIN UNIT</button>
                        </div>

                        <div className={styles.cohortCard} style={{ background: 'linear-gradient(160deg, #1a0828 0%, #120518 40%, #0a0310 100%)', borderColor: 'rgba(155, 89, 247, 0.2)' }}>
                            <div className={styles.cohortHeader}>
                                <div>
                                    <h3>BATCH 03 — PH CHARLIE</h3>
                                    <span className={styles.cohortSub}>Starts: Apr 2026</span>
                                </div>
                                <div className={styles.statusBadge} style={{ color: '#9b59f5', borderColor: '#9b59f5', padding: '2px 8px', border: '1px solid', borderRadius: '4px' }}>PURPLE_TEAM</div>
                            </div>
                            <div className={styles.cohortStats}>
                                <div className={styles.statValue}>18 <span>ENROLLED</span></div>
                                <div className={styles.statValue}>--- <span>AVG_PROGRESS</span></div>
                            </div>
                            <div className={styles.progressBarBg}><div className={styles.progressBarFill} style={{ width: '0%', background: '#9b59f5' }}></div></div>
                            <button className={styles.cohortBtn}>ENROLL NOW</button>
                        </div>
                    </div>
                </div>

                {/* OPERATION BOARD (FEAT-05) */}
                <div className={styles.operationBoardSection}>
                    <h2 className={styles.sectionHeading}>OPERATION BOARD</h2>
                    <div className={styles.ctfGrid}>
                        <div className={styles.ctfCard}>
                            <div className={styles.ctfHeader}>
                                <h3>HackTheBox: Cyber Apocalypse</h3>
                                <div className={styles.ctfDifficulty} style={{ backgroundColor: 'rgba(229,57,53,0.15)', color: '#e53935', borderColor: '#e53935' }}>ADVANCED</div>
                            </div>
                            <p className={styles.ctfDetails}>Global CTF competition spanning 5 days focusing on Web, Crypto, Pwn, and Forensics.</p>
                            <div className={styles.ctfMeta}>
                                <span>📅 May 10 - May 15, 2026</span>
                                <span>🌐 HackTheBox</span>
                            </div>
                            <div className={styles.ctfActions}>
                                <button className={styles.btnPrimary}>FORM TEAM</button>
                                <button className={styles.btnSecondary}>JOIN EXISTING TEAM</button>
                            </div>
                        </div>

                        <div className={styles.ctfCard}>
                            <div className={styles.ctfHeader}>
                                <h3>Rootcon 2026 Qualifications</h3>
                                <div className={styles.ctfDifficulty} style={{ backgroundColor: 'rgba(245,166,35,0.15)', color: '#f5a623', borderColor: '#f5a623' }}>INTERMEDIATE</div>
                            </div>
                            <p className={styles.ctfDetails}>The official qualifier round for the Philippines' premier hacker conference.</p>
                            <div className={styles.ctfMeta}>
                                <span>📅 July 24 - July 26, 2026</span>
                                <span>🌐 Online (PH)</span>
                            </div>
                            <div className={styles.ctfActions}>
                                <button className={styles.btnPrimary}>FORM TEAM</button>
                                <button className={styles.btnSecondary}>JOIN EXISTING TEAM</button>
                            </div>
                        </div>

                        <div className={styles.ctfCard}>
                            <div className={styles.ctfHeader}>
                                <h3>PicoCTF 2026</h3>
                                <div className={styles.ctfDifficulty} style={{ backgroundColor: 'rgba(76,175,80,0.15)', color: '#4caf50', borderColor: '#4caf50' }}>BEGINNER</div>
                            </div>
                            <p className={styles.ctfDetails}>A free computer security education program with original content built on a CTF framework.</p>
                            <div className={styles.ctfMeta}>
                                <span>📅 Sept 01 - Sept 14, 2026</span>
                                <span>🌐 CMU</span>
                            </div>
                            <div className={styles.ctfActions}>
                                <button className={styles.btnPrimary}>FORM TEAM</button>
                                <button className={styles.btnSecondary}>JOIN EXISTING TEAM</button>
                            </div>
                        </div>
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
        </div>
    );
}

// Team Icons - Gold Standard Line Art
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
