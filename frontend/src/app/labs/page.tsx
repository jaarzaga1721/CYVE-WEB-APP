'use client';

import { useState } from 'react';
import ProtectedRoute from '@/app/Homepage/components/ProtectedRoute';
import styles from './labs.module.css';

const LABS = [
    {
        id: 'nmap-basics',
        title: 'NMAP_RECON_101',
        subtitle: 'Port Scanning & Network Discovery',
        team: 'red',
        difficulty: 'ENTRY',
        duration: '45 MIN',
        xp: 120,
        tags: ['Reconnaissance', 'Networking', 'Linux'],
        description: 'Deploy NMAP to map a simulated corporate network. Identify open ports, services, and OS fingerprinting techniques.',
        objectives: ['Run a SYN scan on target subnet', 'Identify vulnerable services', 'Generate a recon report'],
    },
    {
        id: 'burp-web-intercept',
        title: 'BURP_INTERCEPT_PROTOCOL',
        subtitle: 'Web Application Proxy & Tampering',
        team: 'red',
        difficulty: 'INTERMEDIATE',
        duration: '90 MIN',
        xp: 280,
        tags: ['Web Security', 'Burp Suite', 'OWASP'],
        description: 'Configure Burp Suite as a MITM proxy and intercept HTTP/S traffic to test for injection vulnerabilities.',
        objectives: ['Setup Burp proxy', 'Intercept and modify POST requests', 'Identify SQLi and XSS vectors'],
    },
    {
        id: 'siem-log-analysis',
        title: 'SIEM_THREAT_CORRELATION',
        subtitle: 'Log Analysis & Alert Triage',
        team: 'blue',
        difficulty: 'INTERMEDIATE',
        duration: '60 MIN',
        xp: 200,
        tags: ['SIEM', 'Splunk', 'Log Analysis'],
        description: 'Analyze simulated security logs using a SIEM dashboard. Identify indicators of compromise and triage alerts by severity.',
        objectives: ['Load log dataset into SIEM', 'Build detection rules', 'Write an incident report'],
    },
    {
        id: 'incident-response-sim',
        title: 'INCIDENT_RESPONSE_DRILL',
        subtitle: 'Containment & Eradication Protocol',
        team: 'blue',
        difficulty: 'ADVANCED',
        duration: '120 MIN',
        xp: 450,
        tags: ['Incident Response', 'Forensics', 'NIST Framework'],
        description: 'Execute a structured incident response playbook on a simulated ransomware attack. Contain, eradicate, and recover.',
        objectives: ['Identify patient zero', 'Isolate affected systems', 'Draft post-incident report'],
    },
    {
        id: 'threat-intel-osint',
        title: 'OSINT_INTEL_GATHERING',
        subtitle: 'Open Source Intelligence Operations',
        team: 'purple',
        difficulty: 'ENTRY',
        duration: '45 MIN',
        xp: 150,
        tags: ['OSINT', 'Threat Intel', 'Social Engineering'],
        description: 'Use OSINT tools and methodologies to gather intelligence on a simulated threat actor profile.',
        objectives: ['Use Maltego for entity mapping', 'Cross-reference dark web mentions', 'Build a threat actor profile'],
    },
    {
        id: 'purple-team-exercise',
        title: 'PURPLE_TEAM_COLLAB_SIM',
        subtitle: 'Offensive + Defensive Synchronized Ops',
        team: 'purple',
        difficulty: 'ADVANCED',
        duration: '180 MIN',
        xp: 600,
        tags: ['Red/Blue Sync', 'ATT&CK', 'Threat Modeling'],
        description: 'Run a synchronized red and blue team exercise using the MITRE ATT&CK framework. Measure detection coverage.',
        objectives: ['Map attacks to ATT&CK TTPs', 'Measure detection rates', 'Optimize detection rules'],
    },
];

const TEAM_COLORS: Record<string, string> = {
    red: 'var(--color-red-team)',
    blue: 'var(--color-blue-team)',
    purple: 'var(--color-purple-team)',
};

const DIFF_COLORS: Record<string, string> = {
    ENTRY: '#4caf50',
    INTERMEDIATE: '#f5a623',
    ADVANCED: '#e05252',
};

export default function LabsPage() {
    return (
        <ProtectedRoute>
            <LabsContent />
        </ProtectedRoute>
    );
}

function LabsContent() {
    const [filter, setFilter] = useState<'all' | 'red' | 'blue' | 'purple'>('all');
    const [activelab, setActiveLab] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(false);
    const [initStage, setInitStage] = useState(0);

    const filtered = filter === 'all' ? LABS : LABS.filter(l => l.team === filter);
    const activeLab = LABS.find(l => l.id === activelab);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.terminalHeader}>
                        <span className={styles.prompt}>admin@cyve:~$</span>
                        <span className={styles.typing}> access_labs --all-clearance</span>
                    </div>
                    <h1>MISSION_LABS</h1>
                    <p>SKILL_VERIFICATION_PROTOCOL // SELECT_OBJECTIVE</p>
                </header>

                {/* Team filter */}
                <div className={styles.filterBar}>
                    {(['all', 'red', 'blue', 'purple'] as const).map(f => (
                        <button
                            key={f}
                            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                            onClick={() => setFilter(f)}
                            style={filter === f && f !== 'all' ? { borderColor: TEAM_COLORS[f], color: TEAM_COLORS[f] } : {}}
                        >
                            {f === 'all' ? 'ALL_OPS' : `${f.toUpperCase()}_TEAM`}
                        </button>
                    ))}
                </div>

                {/* Labs grid */}
                <div className={styles.labsGrid}>
                    {filtered.map(lab => (
                        <div
                            key={lab.id}
                            className={`${styles.labCard} ${activelab === lab.id ? styles.labCardActive : ''}`}
                            style={{ '--team-color': TEAM_COLORS[lab.team] } as React.CSSProperties}
                            onClick={() => setActiveLab(activelab === lab.id ? null : lab.id)}
                        >
                            <div className={styles.labCardTop}>
                                <span className={styles.labTeam} style={{ color: TEAM_COLORS[lab.team], borderColor: TEAM_COLORS[lab.team] }}>
                                    {lab.team.toUpperCase()}
                                </span>
                                <span className={styles.labDifficulty} style={{ color: DIFF_COLORS[lab.difficulty] }}>
                                    {lab.difficulty}
                                </span>
                            </div>
                            <h3 className={styles.labTitle}>{lab.title}</h3>
                            <p className={styles.labSubtitle}>{lab.subtitle}</p>
                            <p className={styles.labDescription}>{lab.description}</p>
                            <div className={styles.labTags}>
                                {lab.tags.map(tag => (
                                    <span key={tag} className={styles.labTag}>{tag}</span>
                                ))}
                            </div>
                            <div className={styles.labFooter}>
                                <span className={styles.labMeta}>⏱ {lab.duration}</span>
                                <span className={styles.labXp} style={{ color: TEAM_COLORS[lab.team] }}>+{lab.xp} XP</span>
                            </div>

                            {activelab === lab.id && (
                                <div className={styles.labObjectives}>
                                    <h4>OBJECTIVES:</h4>
                                    <ul>
                                        {lab.objectives.map((obj, i) => (
                                            <li key={i}>
                                                <span className={styles.objNum}>[{String(i + 1).padStart(2, '0')}]</span> {obj}
                                            </li>
                                        ))}
                                    </ul>
                                    <button 
                                        className={styles.startBtn} 
                                        style={{ borderColor: TEAM_COLORS[lab.team], color: TEAM_COLORS[lab.team] }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsInitializing(true);
                                            // Simulated multi-stage init
                                            setTimeout(() => setInitStage(1), 800);
                                            setTimeout(() => setInitStage(2), 1600);
                                            setTimeout(() => setInitStage(3), 2400);
                                            setTimeout(() => {
                                                setIsInitializing(false);
                                                setInitStage(0);
                                                alert(`ENVIRONMENT_READY: Uplink established to ${lab.title}. Virtual terminal is active.`);
                                            }, 3200);
                                        }}
                                    >
                                        DEPLOY_LAB →
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Lab Initialization Overlay */}
            {isInitializing && (
                <div className={styles.initOverlay}>
                    <div className={styles.initBox} style={{ '--team-color': TEAM_COLORS[activeLab?.team || 'red'] } as React.CSSProperties}>
                        <div className={styles.scanline} />
                        <div className={styles.initTitle}>INITIALIZING_ENVIRONMENT</div>
                        <div className={styles.initDossier}>{activeLab?.title} // SECTOR_IDENTIFIED</div>
                        
                        <div className={styles.initStages}>
                            <div className={`${styles.stage} ${initStage >= 1 ? styles.stageActive : ''}`}>
                                [01] PROVISIONING_VIRTUAL_NODE... {initStage >= 1 ? 'DONE' : '...'}
                            </div>
                            <div className={`${styles.stage} ${initStage >= 2 ? styles.stageActive : ''}`}>
                                [02] SYNCING_TOOLSET_REPOSITORY... {initStage >= 2 ? 'DONE' : '...'}
                            </div>
                            <div className={`${styles.stage} ${initStage >= 3 ? styles.stageActive : ''}`}>
                                [03] ESTABLISHING_SECURE_TTY... {initStage >= 3 ? 'READY' : '...'}
                            </div>
                        </div>

                        <div className={styles.terminalPreview}>
                            <div className={styles.termHeader}>TTY_0x82a / root@cyve-lab</div>
                            <div className={styles.termBody}>
                                {initStage >= 1 && <div className={styles.termLine}>&gt; nmap -sV -O stealth_module_01...</div>}
                                {initStage >= 2 && <div className={styles.termLine}>&gt; services identify results... 100%</div>}
                                {initStage >= 3 && <div className={styles.termLine}>&gt; access_granted: node_online</div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
