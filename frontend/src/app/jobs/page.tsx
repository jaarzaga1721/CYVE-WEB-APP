'use client';

import { useState, useMemo } from 'react';
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
                                <button className={styles.applyBtn} style={{ borderColor: TEAM_COLORS[job.team], color: TEAM_COLORS[job.team] }}>
                                    VIEW_ASSIGNMENT →
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
        </div>
    );
}
