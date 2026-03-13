'use client';

import { useRef, useState } from 'react';
import styles from './IDCard.module.css';

interface IDCardProps {
    name: string;
    email: string;
    role: 'red' | 'blue' | 'purple' | null;
    progress: number;
    operativeId?: string;
}

const ROLE_CONFIG = {
    red: {
        label: 'RED TEAM',
        sublabel: 'OFFENSIVE SPECIALIST',
        color: '#e05252',
        glow: 'rgba(224, 82, 82, 0.4)',
        accent: '#ff4444',
        code: 'RT',
    },
    blue: {
        label: 'BLUE TEAM',
        sublabel: 'DEFENSIVE OPERATIVE',
        color: '#4a9eff',
        glow: 'rgba(74, 158, 255, 0.4)',
        accent: '#4488ff',
        code: 'BT',
    },
    purple: {
        label: 'PURPLE TEAM',
        sublabel: 'HYBRID STRATEGIST',
        color: '#9b59f5',
        glow: 'rgba(155, 89, 245, 0.4)',
        accent: '#a855f7',
        code: 'PT',
    },
};

const DEFAULT_ROLE = {
    label: 'UNASSIGNED',
    sublabel: 'PENDING CLASSIFICATION',
    color: '#888888',
    glow: 'rgba(136, 136, 136, 0.4)',
    accent: '#aaaaaa',
    code: 'UA',
};

export default function IDCard({ name, email, role, progress, operativeId }: IDCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const roleConfig = role ? ROLE_CONFIG[role] : DEFAULT_ROLE;
    const displayName = name || email?.split('@')[0] || 'OPERATIVE';
    const id = operativeId || `CYVE-${Math.abs(hashCode(email || 'unknown')).toString(16).padStart(6, '0').toUpperCase()}`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / (width / 2);
        const y = (e.clientY - top - height / 2) / (height / 2);
        setTilt({ x: y * -12, y: x * 12 });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setIsHovered(false);
    };

    return (
        <div className={styles.cardScene}>
            <div
                ref={cardRef}
                className={`${styles.card} ${isHovered ? styles.hovered : ''}`}
                style={{
                    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    '--role-color': roleConfig.color,
                    '--role-glow': roleConfig.glow,
                    '--role-accent': roleConfig.accent,
                } as React.CSSProperties}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
            >
                {/* Holographic sheen */}
                <div className={styles.sheen} />
                <div className={styles.scanline} />

                {/* Top Row */}
                <div className={styles.cardTop}>
                    <div className={styles.brandMark}>
                        <span className={styles.brandLogo}>CYVE</span>
                        <span className={styles.brandSub}>SECURE_OPERATIONS</span>
                    </div>
                    <div className={styles.classificationBadge} style={{ borderColor: roleConfig.color, color: roleConfig.color }}>
                        {roleConfig.code}
                    </div>
                </div>

                {/* Avatar */}
                <div className={styles.avatarSection}>
                    <div className={styles.avatarRing} style={{ borderColor: roleConfig.color, boxShadow: `0 0 20px ${roleConfig.glow}` }}>
                        <div className={styles.avatarInner} style={{ background: `linear-gradient(135deg, ${roleConfig.color}22, ${roleConfig.color}44)` }}>
                            <span className={styles.avatarInitial} style={{ color: roleConfig.color }}>
                                {displayName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className={styles.statusDot} />
                </div>

                {/* Identity */}
                <div className={styles.identity}>
                    <h2 className={styles.operativeName}>{displayName.toUpperCase()}</h2>
                    <div className={styles.roleLabel} style={{ color: roleConfig.color }}>{roleConfig.label}</div>
                    <div className={styles.roleSubLabel}>{roleConfig.sublabel}</div>
                </div>

                {/* Stats row */}
                <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                        <span className={styles.statVal}>{progress}%</span>
                        <span className={styles.statKey}>MISSION</span>
                    </div>
                    <div className={styles.statDivider} style={{ borderColor: roleConfig.color }} />
                    <div className={styles.statItem}>
                        <span className={styles.statVal} style={{ color: roleConfig.color }}>ACTIVE</span>
                        <span className={styles.statKey}>STATUS</span>
                    </div>
                    <div className={styles.statDivider} style={{ borderColor: roleConfig.color }} />
                    <div className={styles.statItem}>
                        <span className={styles.statVal}>∞</span>
                        <span className={styles.statKey}>CLEARANCE</span>
                    </div>
                </div>

                {/* ID number */}
                <div className={styles.cardBottom}>
                    <span className={styles.idCode}>{id}</span>
                    <div className={styles.barcode}>
                        {Array.from({ length: 28 }).map((_, i) => (
                            <div key={i} className={styles.bar} style={{ height: `${Math.random() * 16 + 8}px`, opacity: Math.random() * 0.5 + 0.5 }} />
                        ))}
                    </div>
                </div>

                {/* Corner accent */}
                <div className={styles.cornerTL} style={{ borderColor: roleConfig.color }} />
                <div className={styles.cornerBR} style={{ borderColor: roleConfig.color }} />
            </div>
        </div>
    );
}

// Simple string hash for deterministic ID generation
function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return hash;
}
