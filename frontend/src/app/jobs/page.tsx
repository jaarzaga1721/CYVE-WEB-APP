'use client';

import { useState, useMemo, useEffect } from 'react';
import ProtectedRoute from '@/app/Homepage/components/ProtectedRoute';
import styles from './jobs.module.css';

const JOBS = [
    { id: 1, title: 'Penetration Tester', company: 'Globe Telecom', location: 'Taguig, Metro Manila', team: 'red', type: 'Full-time', salary: '₱80,000 – ₱120,000/mo', tags: ['OSCP', 'Kali Linux', 'Web App Sec'], posted: '2d ago' },
    { id: 2, title: 'Red Team Operator', company: 'BDO Unibank', location: 'Makati, Metro Manila', team: 'red', type: 'Full-time', salary: '₱100,000 – ₱150,000/mo', tags: ['C2 Frameworks', 'Exploit Dev', 'Active Directory'], posted: '5d ago' },
    { id: 3, title: 'SOC Analyst (Tier II)', company: 'Accenture PH', location: 'BGC, Metro Manila', team: 'blue', type: 'Full-time', salary: '₱55,000 – ₱75,000/mo', tags: ['Splunk', 'CySA+', 'Incident Response'], posted: '1d ago' },
    { id: 4, title: 'Incident Response Analyst', company: 'Security Bank', location: 'Makati, Metro Manila', team: 'blue', type: 'Full-time', salary: '₱70,000 – ₱95,000/mo', tags: ['SIEM', 'NIST Framework', 'Forensics'], posted: '3d ago' },
    { id: 5, title: 'Threat Intelligence Analyst', company: 'PLDT', location: 'Mandaluyong, Metro Manila', team: 'purple', type: 'Full-time', salary: '₱75,000 – ₱110,000/mo', tags: ['OSINT', 'MITRE ATT&CK', 'Threat Modeling'], posted: '1w ago' },
    { id: 6, title: 'Cloud Security Engineer', company: 'UnionBank', location: 'Pasig, Metro Manila', team: 'purple', type: 'Full-time', salary: '₱90,000 – ₱130,000/mo', tags: ['AWS', 'DevSecOps', 'CCSP'], posted: '4d ago' },
    { id: 7, title: 'Junior Vulnerability Analyst', company: 'Smart Communications', location: 'Mandaluyong, Metro Manila', team: 'red', type: 'Full-time', salary: '₱40,000 – ₱60,000/mo', tags: ['Nmap', 'Nessus', 'Security+'], posted: '2w ago' },
    { id: 8, title: 'Network Security Analyst', company: 'Meralco', location: 'Pasig, Metro Manila', team: 'blue', type: 'Full-time', salary: '₱60,000 – ₱85,000/mo', tags: ['Firewalls', 'IDS/IPS', 'CompTIA CySA+'], posted: '6d ago' },
    { id: 9, title: 'Security Consultant (Hybrid)', company: 'Deloitte PH', location: 'BGC, Metro Manila', team: 'purple', type: 'Contract', salary: '₱110,000 – ₱180,000/mo', tags: ['GRC', 'ISO 27001', 'Pen Testing'], posted: '3d ago' },
];

const TEAM_COLORS: Record<string, string> = {
    red: 'var(--color-red-team)',
    blue: 'var(--color-blue-team)',
    purple: 'var(--color-purple-team)',
};

const TEAM_LABELS: Record<string, string> = {
    red: 'RED TEAM',
    blue: 'BLUE TEAM',
    purple: 'PURPLE TEAM',
};

export default function JobsPage() {
    return (
        <ProtectedRoute>
            <JobsContent />
        </ProtectedRoute>
    );
}

function JobsContent() {
    const [filter, setFilter] = useState<'all' | 'red' | 'blue' | 'purple'>('all');
    const [search, setSearch] = useState('');
    const [selectedJob, setSelectedJob] = useState<typeof JOBS[0] | null>(null);
    const [isDecrypting, setIsDecrypting] = useState(false);

    const filtered = useMemo(() => {
        return JOBS.filter(job => {
            const matchTeam = filter === 'all' || job.team === filter;
            const q = search.toLowerCase();
            const matchSearch = !q || job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q) || job.tags.some(t => t.toLowerCase().includes(q));
            return matchTeam && matchSearch;
        });
    }, [filter, search]);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.terminalHeader}>
                        <span className={styles.prompt}>admin@cyve:~$</span>
                        <span className={styles.typing}> access_recruiter --ph-sector</span>
                    </div>
                    <h1>CYBER_OPS_RECRUITMENT</h1>
                    <p>ACTIVE_LISTINGS // PH_SECTOR_ONLY</p>
                </header>

                {/* Controls */}
                <div className={styles.controls}>
                    <div className={styles.searchWrap}>
                        <span className={styles.searchIcon}>⌕</span>
                        <input
                            className={styles.searchInput}
                            placeholder="Search by role, company, or skill..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className={styles.filterBar}>
                        {(['all', 'red', 'blue', 'purple'] as const).map(f => (
                            <button
                                key={f}
                                className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                                onClick={() => setFilter(f)}
                                style={filter === f && f !== 'all' ? { borderColor: TEAM_COLORS[f], color: TEAM_COLORS[f] } : {}}
                            >
                                {f === 'all' ? 'ALL' : `${f.toUpperCase()}_TEAM`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Listings */}
                <div className={styles.resultsCount}>
                    <span className={styles.count}>{filtered.length}</span> LISTINGS_FOUND
                </div>

                <div className={styles.jobsList}>
                    {filtered.map(job => (
                        <div
                            key={job.id}
                            className={styles.jobCard}
                            style={{ '--team-color': TEAM_COLORS[job.team] } as React.CSSProperties}
                        >
                            <div className={styles.jobCardAccent} style={{ background: TEAM_COLORS[job.team] }} />
                            <div className={styles.jobMain}>
                                <div className={styles.jobTop}>
                                    <div>
                                        <h3 className={styles.jobTitle}>{job.title}</h3>
                                        <p className={styles.jobCompany}>{job.company}</p>
                                    </div>
                                    <div className={styles.jobMeta}>
                                        <span className={styles.teamBadge} style={{ color: TEAM_COLORS[job.team], borderColor: TEAM_COLORS[job.team] }}>
                                            {TEAM_LABELS[job.team]}
                                        </span>
                                        <span className={styles.jobPosted}>{job.posted}</span>
                                    </div>
                                </div>
                                <div className={styles.jobDetails}>
                                    <span className={styles.jobDetail}>📍 {job.location}</span>
                                    <span className={styles.jobDetail}>💼 {job.type}</span>
                                    <span className={styles.jobDetail} style={{ color: 'var(--color-gold)' }}>💰 {job.salary}</span>
                                </div>
                                <div className={styles.jobTags}>
                                    {job.tags.map(tag => (
                                        <span key={tag} className={styles.jobTag}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.jobActions}>
                                <button 
                                    className={styles.applyBtn} 
                                    style={{ borderColor: TEAM_COLORS[job.team], color: TEAM_COLORS[job.team] }}
                                    onClick={() => {
                                        setIsDecrypting(true);
                                        setTimeout(() => {
                                            setSelectedJob(job);
                                            setIsDecrypting(false);
                                        }, 1200);
                                    }}
                                >
                                    {isDecrypting && selectedJob?.id === job.id ? 'DECRYPTING...' : 'VIEW_ASSIGNMENT →'}
                                </button>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className={styles.empty}>
                            <p>NO_LISTINGS_FOUND // Adjust search parameters and retry.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Assignment Briefing Modal */}
            {selectedJob && (
                <JobAssignmentModal 
                    job={selectedJob} 
                    onClose={() => setSelectedJob(null)} 
                />
            )}

            {/* Decryption Overlay */}
            {isDecrypting && (
                <div className={styles.decryptOverlay}>
                    <div className={styles.decryptBox}>
                        <div className={styles.scanline} />
                        <div className={styles.decryptText}>ESTABLISHING_SECURE_TUNNEL...</div>
                        <div className={styles.decryptProgress}>
                            <div className={styles.progressBar} />
                        </div>
                        <div className={styles.nodeStatus}>NODE_SYNC: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

function JobAssignmentModal({ job, onClose }: { job: typeof JOBS[0], onClose: () => void }) {
    const [agreed, setAgreed] = useState(false);
    const [stage, setStage] = useState<'briefing' | 'scanning' | 'signing' | 'verified'>('briefing');
    const [scanProgress, setScanProgress] = useState(0);

    const teamColor = TEAM_COLORS[job.team];

    useEffect(() => {
        if (stage === 'scanning') {
            const interval = setInterval(() => {
                setScanProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setStage('signing'), 500);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 30);
            return () => clearInterval(interval);
        }
    }, [stage]);

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()} style={{ '--team-color': teamColor } as React.CSSProperties}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalHeaderLeft}>
                        <span className={styles.briefingId}>BRIEFING_ID: #{job.id * 739}</span>
                        <h2 style={{ color: teamColor }}>{job.title.toUpperCase()}</h2>
                        <p>{job.company} // {job.location}</p>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.modalBody}>
                    {stage === 'briefing' && (
                        <>
                            <section className={styles.missionBrief}>
                                <h3><span className={styles.sectionIcon}>[!]</span> MISSION_OBJECTIVE</h3>
                                <p>
                                    Perform deep-sector analysis and infrastructure assessment for {job.company}. 
                                    Specialization in {job.tags.join(', ')} is critical for successful infiltration and data extraction within the Taguig/Makati grid.
                                </p>
                            </section>

                            <section className={styles.techStack}>
                                <h3><span className={styles.sectionIcon}>[#]</span> TECHNICAL_REQUIREMENTS</h3>
                                <div className={styles.requirementsGrid}>
                                    {job.tags.map(tag => (
                                        <div key={tag} className={styles.reqItem}>
                                            <span className={styles.reqDot} style={{ background: teamColor }} />
                                            {tag}
                                        </div>
                                    ))}
                                    <div className={styles.reqItem}>
                                        <span className={styles.reqDot} style={{ background: teamColor }} />
                                        {job.type.toUpperCase()}
                                    </div>
                                </div>
                            </section>

                            <section className={styles.compliance}>
                                <h3><span className={styles.sectionIcon}>[§]</span> ACADEMIC_COMPLIANCE</h3>
                                <div className={styles.complianceBox}>
                                    <label className={styles.checkboxLabel}>
                                        <input 
                                            type="checkbox" 
                                            checked={agreed} 
                                            onChange={e => setAgreed(e.target.checked)} 
                                        />
                                        <span className={styles.customCheck} />
                                        I acknowledge that all actions performed during this assignment are logged for audit compliance.
                                    </label>
                                </div>
                            </section>
                        </>
                    )}

                    {stage === 'scanning' && (
                        <div className={styles.biometricHUD}>
                            <div className={styles.scanTarget}>
                                <div className={styles.reticle} style={{ borderColor: teamColor }} />
                                <div className={styles.scanLine} style={{ background: `linear-gradient(to bottom, transparent, ${teamColor})` }} />
                                <svg className={styles.fingerprint} viewBox="0 0 24 24" fill="none" stroke={teamColor} strokeWidth="1">
                                    <path d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z" />
                                    <path d="M10 21V10c0-1.1.9-2 2-2s2 .9 2 2v11" />
                                    <path d="M7 18v-7c0-2.8 2.2-5 5-5s5 2.2 5 5v7" />
                                    <path d="M4 15v-4c0-4.4 3.6-8 8-8s8 3.6 8 8v4" />
                                </svg>
                            </div>
                            <div className={styles.hudMeta}>
                                <div className={styles.hudTitle}>BIometric_AUTH_REQUIRED</div>
                                <div className={styles.hudStatus}>SCANNING: {scanProgress}%</div>
                                <div className={styles.hudLog}>
                                    {scanProgress > 20 && <div>{">"} IDENTITY_SYNC_INITIATED</div>}
                                    {scanProgress > 50 && <div>{">"} NEURAL_PATTERN_DETECTED</div>}
                                    {scanProgress > 80 && <div>{">"} VERIFYING_CREDENTIALS...</div>}
                                </div>
                            </div>
                        </div>
                    )}

                    {stage === 'signing' && (
                        <div className={styles.signaturePad}>
                            <div className={styles.padTitle}>DIGITAL_INK_RESERVED</div>
                            <div className={styles.canvasArea}>
                                <div className={styles.signatureGuide}>SIGN_HERE</div>
                                <svg className={styles.autoSignature} viewBox="0 0 200 60">
                                    <path 
                                        d="M30 40c10-5 20-20 30-10 5 10-15 20-5 25s25-10 35-20 15-5 20 5" 
                                        fill="none" 
                                        stroke={teamColor} 
                                        strokeWidth="2" 
                                        strokeDasharray="200"
                                        strokeDashoffset="200"
                                        className={styles.signatureStroke}
                                    />
                                </svg>
                            </div>
                            <div className={styles.padFooter}>
                                Click box below to finalize cryptographic binding
                            </div>
                        </div>
                    )}

                    {stage === 'verified' && (
                        <div className={styles.verifiedState}>
                            <div className={styles.checkSeal} style={{ borderColor: teamColor, color: teamColor }}>
                                ✓
                            </div>
                            <h3>ASSIGNMENT_SECURED</h3>
                            <p>All mission parameters have been logged and secured under sector protocols.</p>
                            <div className={styles.timestamp}>STAMP: {new Date().toISOString()}</div>
                        </div>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <div className={styles.salaryInfo}>
                        <span>ANNUAL_COMPENSATION:</span>
                        <h4 style={{ color: 'var(--color-gold)' }}>{job.salary}</h4>
                    </div>
                    
                    {stage === 'briefing' && (
                        <button 
                            className={`${styles.signBtn} ${agreed ? styles.signActive : ''}`}
                            disabled={!agreed}
                            onClick={() => setStage('scanning')}
                        >
                            INITIATE_VERIFICATION
                        </button>
                    )}

                    {stage === 'signing' && (
                        <button 
                            className={`${styles.signBtn} ${styles.signActive}`}
                            onClick={() => {
                                setStage('verified');
                                setTimeout(onClose, 2500);
                            }}
                        >
                            FINALIZE_SIGNATURE
                        </button>
                    )}

                    {stage === 'verified' && (
                        <button className={`${styles.signBtn} ${styles.signActive}`} onClick={onClose}>
                            SYNCHRONIZING...
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
