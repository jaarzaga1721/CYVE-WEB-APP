'use client';

import ProtectedRoute from '@/app/Homepage/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useProfile, type PreferredRole } from '@/context/ProfileContext';
import { useRoadmap } from '@/context/RoadmapContext';
import { useToast } from '@/context/ToastContext';
import { useStreak } from '@/context/StreakContext';
import { useState } from 'react';
import styles from './profile.module.css';

const ROLE_OPTIONS: { value: PreferredRole; label: string; desc: string }[] = [
    { value: 'red', label: 'Red Team', desc: 'Offensive Security' },
    { value: 'blue', label: 'Blue Team', desc: 'Defensive Security' },
    { value: 'purple', label: 'Purple Team', desc: 'Collaboration & Optimization' },
];

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfileContent />
        </ProtectedRoute>
    );
}

function ProfileContent() {
    const { user } = useAuth();
    const { profile, updateProfile, addEducation, removeEducation, addExperience, removeExperience, addSkill, removeSkill, addCertification } = useProfile();
    const { selectField, getProgress } = useRoadmap();
    const { showToast } = useToast();
    const { streak } = useStreak();
    const [editing, setEditing] = useState(false);
    
    // Modal state for role switching
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [pendingRole, setPendingRole] = useState<PreferredRole | null>(null);

    const [basicInfo, setBasicInfo] = useState({
        name: profile.name || user?.name || '',
        email: profile.email || user?.email || '',
        location: profile.location || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
    });
    const [newSkill, setNewSkill] = useState('');

    // Certifications State
    const [certFormOpen, setCertFormOpen] = useState(false);
    const [newCert, setNewCert] = useState({ name: 'CompTIA Security+', customName: '', date: '', status: 'Obtained' });
    const CERT_OPTIONS = ['CompTIA Security+', 'CEH', 'OSCP', 'eJPT', 'PNPT', 'CompTIA CySA+', 'GPEN', 'GWAPT', 'Other'];

    // Education State
    const [eduFormOpen, setEduFormOpen] = useState(false);
    const [newEdu, setNewEdu] = useState({ school: '', degree: '', field: '', startYear: '', endYear: '', isPresent: false });

    // Experience State
    const [expFormOpen, setExpFormOpen] = useState(false);
    const [newExp, setNewExp] = useState({ company: '', position: '', description: '', startDate: '', endDate: '', isPresent: false });

    const handleSaveBasicInfo = () => {
        updateProfile(basicInfo);
        setEditing(false);
        showToast('Profile saved successfully', 'success');
    };

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            addSkill(newSkill.trim());
            setNewSkill('');
        }
    };

    const handleAddCert = () => {
        const certName = newCert.name === 'Other' ? newCert.customName : newCert.name;
        if (!certName.trim()) return;
        
        // Context is string[], format as inline string for now: "Name;;Date;;Status" to parse out later.
        const formattedCert = `${certName};;${newCert.date || 'TBD'};;${newCert.status}`;
        addCertification(formattedCert);
        setCertFormOpen(false);
        setNewCert({ name: 'CompTIA Security+', customName: '', date: '', status: 'Obtained' });
        showToast('Certification added', 'success');
    };

    const parseCert = (certString: string) => {
        const parts = certString.split(';;');
        return {
            name: parts[0] || certString,
            date: parts[1] || 'N/A',
            status: parts[2] || 'Obtained'
        };
    };

    const handleRoleSelectClick = (role: PreferredRole) => {
        if (profile.preferredRole === role) return; // Already selected
        setPendingRole(role);
        setRoleModalOpen(true);
    };

    const handleAddEdu = () => {
        if (!newEdu.school.trim() || !newEdu.degree.trim()) return;
        addEducation({
            school: newEdu.school,
            degree: newEdu.degree,
            field: newEdu.field,
            startYear: newEdu.startYear,
            endYear: newEdu.isPresent ? 'Present' : newEdu.endYear,
        });
        setEduFormOpen(false);
        setNewEdu({ school: '', degree: '', field: '', startYear: '', endYear: '', isPresent: false });
        showToast('Education added', 'success');
    };

    const handleAddExp = () => {
        if (!newExp.company.trim() || !newExp.position.trim()) return;
        addExperience({
            company: newExp.company,
            position: newExp.position,
            description: newExp.description,
            startDate: newExp.startDate,
            endDate: newExp.isPresent ? 'Present' : newExp.endDate,
        });
        setExpFormOpen(false);
        setNewExp({ company: '', position: '', description: '', startDate: '', endDate: '', isPresent: false });
        showToast('Experience added', 'success');
    };

    const confirmRoleSwitch = () => {
        if (pendingRole) {
            updateProfile({ preferredRole: pendingRole });
            selectField(pendingRole);
            setRoleModalOpen(false);
            setPendingRole(null);
            showToast('New path activated.', 'auth');
            // Roadmap Progress reset is handled by selectField in RoadmapContext
        }
    };

    const cancelRoleSwitch = () => {
        setRoleModalOpen(false);
        setPendingRole(null);
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.avatarContainer}>
                        <div className={`${styles.avatarRing} ${profile.preferredRole ? styles[`ring${profile.preferredRole}`] : ''}`}>
                            <div className={styles.avatarPlaceholder}>
                                ⬡
                            </div>
                        </div>
                    </div>
                    
                    <h1 className={styles.pageTitle}>OPERATIVE DOSSIER</h1>
                    <p className={styles.pageSubtitle}>Your mission record, skills, and career trajectory</p>
                    
                    <div className={styles.identityGroup}>
                        <h2 className={styles.displayName}>{profile.name || user?.name || 'Operative'}</h2>
                        {profile.preferredRole && (
                            <span className={`${styles.teamBadge} ${styles[`badge${profile.preferredRole}`]}`}>
                                {ROLE_OPTIONS.find(r => r.value === profile.preferredRole)?.label.toUpperCase()} — {ROLE_OPTIONS.find(r => r.value === profile.preferredRole)?.desc.toUpperCase()}
                            </span>
                        )}
                    </div>
                    
                    <div className={styles.headerActions} style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button 
                            className={styles.btnOutlined} 
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/profile/public/${user?.name || 'operative'}`);
                                showToast('Public profile link copied to clipboard', 'success');
                            }}
                        >
                            🔗 SHARE_DOSSIER
                        </button>
                    </div>
                </header>

                {/* Mission Stats */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitleAccented}>MISSION_STATS</h2>
                    </div>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{getProgress()}%</div>
                            <div className={styles.statLabel}>ROADMAP_PROGRESS</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{streak.seasonXP}</div>
                            <div className={styles.statLabel}>SEASON_XP</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{streak.currentStreak} <span style={{ fontSize: '1rem' }}>DAYS</span></div>
                            <div className={styles.statLabel}>ACTIVE_STREAK</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue} style={{ color: 'var(--color-gold)' }}>{streak.rank}</div>
                            <div className={styles.statLabel}>CURRENT_RANK</div>
                        </div>
                    </div>
                </section>

                {/* Basic Information */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitleAccented}>INTEL_DOSSIER</h2>
                        {!editing && (
                            <button onClick={() => setEditing(true)} className={styles.btnOutlined}>
                                EDIT_PROFILE
                            </button>
                        )}
                    </div>

                    <div className={styles.card}>
                        {editing ? (
                            <div className={styles.formGrid}>
                                <div className="form-group">
                                    <label className={styles.formLabel}>Name</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        value={basicInfo.name}
                                        onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className={styles.formLabel}>Email 🔒</label>
                                    <input
                                        type="email"
                                        className={`${styles.formInput} ${styles.formInputReadonly}`}
                                        value={basicInfo.email}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group">
                                    <label className={styles.formLabel}>Location</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="City, Country or Remote"
                                        value={basicInfo.location}
                                        onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className={styles.formLabel}>Phone</label>
                                    <input
                                        type="tel"
                                        className={styles.formInput}
                                        placeholder="+63 000 000 0000"
                                        value={basicInfo.phone}
                                        onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className={styles.formLabel}>Bio</label>
                                    <textarea
                                        className={styles.formTextarea}
                                        placeholder="Tell us about yourself..."
                                        value={basicInfo.bio}
                                        onChange={(e) => setBasicInfo({ ...basicInfo, bio: e.target.value })}
                                    />
                                </div>
                                <div className={styles.editActions} style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                                    <button onClick={handleSaveBasicInfo} className={styles.btnPrimary}>
                                        Save Changes
                                    </button>
                                    <button onClick={() => setEditing(false)} className={styles.btnOutlined}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.infoDisplay}>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Name:</span>
                                    <span>{profile.name || user?.name || 'Not set'}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Email:</span>
                                    <span>{profile.email || user?.email || 'Not set'}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Location:</span>
                                    <span>{profile.location || 'Not set'}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Phone:</span>
                                    <span>{profile.phone || 'Not set'}</span>
                                </div>
                                {profile.bio && (
                                    <div className={styles.infoItem} style={{ gridColumn: '1 / -1' }}>
                                        <span className={styles.label}>Bio:</span>
                                        <span>{profile.bio}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Career Path / Preferred Role */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitleAccented}>CAREER_PATH_ASSIGNMENT</h2>
                    </div>
                    <p className={styles.roleHint}>Choose the role that matches your goals. Your roadmap and recommendations will reflect this choice.</p>
                    <div className={styles.roleGrid}>
                        {ROLE_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleRoleSelectClick(opt.value)}
                                className={`${styles.roleCard} ${profile.preferredRole === opt.value ? styles.roleCardActive : ''}`}
                            >
                                <span className={styles.roleLabel}>{opt.label}</span>
                                <span className={styles.roleDesc}>{opt.desc}</span>
                            </button>
                        ))}
                    </div>
                    {profile.preferredRole && (
                        <p className={styles.roleSelected}>
                            Your roadmap is set to <strong>{ROLE_OPTIONS.find(r => r.value === profile.preferredRole)?.label}</strong>.
                        </p>
                    )}
                </section>

                {/* Skills */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitleAccented}>FIELD_SKILLS</h2>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.skillsList}>
                            {profile.skills.length > 0 ? (
                                profile.skills.map((skill, index) => (
                                    <div key={index} className={styles.skillTag}>
                                        {skill}
                                        <button
                                            onClick={() => removeSkill(skill)}
                                            className={styles.removeBtn}
                                            aria-label="Remove skill"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.emptyState}>No skills added yet</p>
                            )}
                        </div>
                        <div className={styles.addSkill}>
                            <input
                                type="text"
                                className={styles.skillInput}
                                placeholder="Add a skill (e.g., Network Security)"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                            />
                            <button onClick={handleAddSkill} className={styles.btnPrimary}>
                                Add
                            </button>
                        </div>
                        <div className={styles.skillSuggestions}>
                            <span className={styles.suggestionLabel}>Suggested skills:</span>
                            {['Python', 'Kali Linux', 'Nmap', 'Burp Suite', 'Bash'].map(skill => (
                                <button 
                                    key={skill} 
                                    className={styles.suggestionChip}
                                    onClick={() => {
                                        addSkill(skill);
                                        showToast(`Added ${skill}`, 'success');
                                    }}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Certifications */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitleAccented}>CERTIFICATIONS_LOG</h2>
                        {!certFormOpen && (
                            <button onClick={() => setCertFormOpen(true)} className={styles.btnOutlined}>
                                + Add Certification
                            </button>
                        )}
                    </div>
                    <div className={styles.card}>
                        {certFormOpen && (
                            <div className={styles.inlineForm}>
                                <div className={styles.formGrid}>
                                    <div className="form-group">
                                        <label className={styles.formLabel}>Certification Name</label>
                                        <select 
                                            className={styles.formInput} 
                                            value={newCert.name}
                                            onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                                        >
                                            {CERT_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {newCert.name === 'Other' && (
                                        <div className="form-group">
                                            <label className={styles.formLabel}>Custom Name</label>
                                            <input 
                                                type="text"
                                                className={styles.formInput}
                                                placeholder="Enter certification name"
                                                value={newCert.customName}
                                                onChange={(e) => setNewCert({ ...newCert, customName: e.target.value })}
                                            />
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <label className={styles.formLabel}>Date Obtained</label>
                                        <input 
                                            type="month"
                                            className={styles.formInput}
                                            value={newCert.date}
                                            onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className={styles.formLabel}>Status</label>
                                        <select 
                                            className={styles.formInput} 
                                            value={newCert.status}
                                            onChange={(e) => setNewCert({ ...newCert, status: e.target.value })}
                                        >
                                            <option value="Obtained">Obtained</option>
                                            <option value="In Progress">In Progress</option>
                                        </select>
                                    </div>
                                    <div className={styles.editActions} style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                                        <button onClick={handleAddCert} className={styles.btnPrimary}>
                                            Save Certification
                                        </button>
                                        <button onClick={() => setCertFormOpen(false)} className={styles.btnOutlined}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                                <hr className={styles.divider} />
                            </div>
                        )}

                        {profile.certifications.length === 0 && !certFormOpen ? (
                            <details className={styles.emptySectionDetails}>
                                <summary className={styles.emptySectionSummary}>
                                    No certifications on record. Reveal to add your first credential.
                                </summary>
                                <div className={styles.emptySectionContent}>
                                    <div className={styles.emptyState}>
                                        <p>Link your active or in-progress certifications.</p>
                                        <button onClick={() => setCertFormOpen(true)} className={styles.btnPrimary}>
                                            Add First Certification
                                        </button>
                                        <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                                            <a href="/roadmap" className={styles.resourceLink}>Check the Roadmap for recommended certs →</a>
                                        </p>
                                    </div>
                                </div>
                            </details>
                        ) : profile.certifications.length > 0 ? (
                            <div className={styles.certList}>
                                {profile.certifications.map((cert, index) => {
                                    const parsed = parseCert(cert);
                                    return (
                                        <div key={index} className={styles.certItem}>
                                            <div className={styles.certItemMeta}>
                                                <span className={styles.certName}>🏆 {parsed.name}</span>
                                                <span className={styles.certDate}>{parsed.date}</span>
                                            </div>
                                            <div className={styles.certItemMetaRight}>
                                                <span className={`${styles.statusBadge} ${parsed.status === 'Obtained' ? styles.statusGreen : styles.statusGold}`}>
                                                    {parsed.status}
                                                </span>
                                                <button onClick={() => updateProfile({ certifications: profile.certifications.filter((_, i) => i !== index) })} className={styles.removeBtn}>
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            !certFormOpen && <p className={styles.emptyState}>No certifications added yet. <a href="/roadmap" style={{ color: 'var(--color-gold)', textDecoration: 'underline' }}>Check the Roadmap for recommended certs →</a></p>
                        )}
                    </div>
                </section>

                {/* Education */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitleAccented}>EDUCATION_LOG</h2>
                        {!eduFormOpen && (
                            <button onClick={() => setEduFormOpen(true)} className={styles.btnOutlined}>
                                + Add Education
                            </button>
                        )}
                    </div>
                    <div className={styles.card}>
                        {eduFormOpen && (
                            <div className={styles.inlineForm}>
                                <div className={styles.formGrid}>
                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className={styles.formLabel}>School / Institution</label>
                                        <input 
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="e.g. University of Example"
                                            value={newEdu.school}
                                            onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className={styles.formLabel}>Degree / Certification Level</label>
                                        <input 
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="e.g. B.S. or Bootcamp"
                                            value={newEdu.degree}
                                            onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className={styles.formLabel}>Field of Study</label>
                                        <input 
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="e.g. Computer Science"
                                            value={newEdu.field}
                                            onChange={(e) => setNewEdu({ ...newEdu, field: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className={styles.formLabel}>Start Year</label>
                                        <input 
                                            type="number"
                                            className={styles.formInput}
                                            placeholder="YYYY"
                                            value={newEdu.startYear}
                                            onChange={(e) => setNewEdu({ ...newEdu, startYear: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className={styles.formLabel}>End Year</label>
                                        {!newEdu.isPresent ? (
                                            <input 
                                                type="number"
                                                className={styles.formInput}
                                                placeholder="YYYY"
                                                value={newEdu.endYear}
                                                onChange={(e) => setNewEdu({ ...newEdu, endYear: e.target.value })}
                                            />
                                        ) : (
                                            <input 
                                                type="text"
                                                className={`${styles.formInput} ${styles.formInputReadonly}`}
                                                value="Present"
                                                readOnly
                                            />
                                        )}
                                        <label className={styles.checkboxLabel} style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={newEdu.isPresent}
                                                onChange={(e) => setNewEdu({ ...newEdu, isPresent: e.target.checked })}
                                                style={{ accentColor: 'var(--color-gold)' }}
                                            />
                                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>I am currently studying here</span>
                                        </label>
                                    </div>
                                    <div className={styles.editActions} style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                                        <button onClick={handleAddEdu} className={styles.btnPrimary}>
                                            Save Education
                                        </button>
                                        <button onClick={() => setEduFormOpen(false)} className={styles.btnOutlined}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                                <hr className={styles.divider} />
                            </div>
                        )}

                        {profile.education.length === 0 && !eduFormOpen ? (
                            <details className={styles.emptySectionDetails}>
                                <summary className={styles.emptySectionSummary}>
                                    No education added yet. Reveal to add your academic history or self-taught courses.
                                </summary>
                                <div className={styles.emptySectionContent}>
                                    <div className={styles.emptyState}>
                                        <p>Self-taught? Add your bootcamps and online courses too.</p>
                                        <button onClick={() => setEduFormOpen(true)} className={styles.btnPrimary}>
                                            Add Education
                                        </button>
                                    </div>
                                </div>
                            </details>
                        ) : profile.education.length > 0 ? (
                            <div className={styles.list}>
                                {profile.education.map((edu) => (
                                    <div key={edu.id} className={styles.listItem}>
                                        <div className={styles.itemContent}>
                                            <h4>{edu.school}</h4>
                                            <p>{edu.degree} {edu.field ? `· ${edu.field}` : ''} </p>
                                            <p className={styles.date}>{edu.startYear} - {edu.endYear}</p>
                                        </div>
                                        <button onClick={() => removeEducation(edu.id)} className={styles.btnOutlined} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </section>

                {/* Experience */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitleAccented}>FIELD_EXPERIENCE</h2>
                        {!expFormOpen && (
                            <button onClick={() => setExpFormOpen(true)} className={styles.btnOutlined}>
                                + Add Experience
                            </button>
                        )}
                    </div>
                    <div className={styles.card}>
                        {expFormOpen && (
                            <div className={styles.inlineForm}>
                                <div className={styles.formGrid}>
                                    <div className="form-group">
                                        <label className={styles.formLabel}>Job Title</label>
                                        <input 
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="e.g. Junior SOC Analyst"
                                            value={newExp.position}
                                            onChange={(e) => setNewExp({ ...newExp, position: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className={styles.formLabel}>Company / Organization</label>
                                        <input 
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="e.g. CyberCorp Inc."
                                            value={newExp.company}
                                            onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className={styles.formLabel}>Start Year</label>
                                        <input 
                                            type="number"
                                            className={styles.formInput}
                                            placeholder="YYYY"
                                            value={newExp.startDate}
                                            onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className={styles.formLabel}>End Year</label>
                                        {!newExp.isPresent ? (
                                            <input 
                                                type="number"
                                                className={styles.formInput}
                                                placeholder="YYYY"
                                                value={newExp.endDate}
                                                onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                                            />
                                        ) : (
                                            <input 
                                                type="text"
                                                className={`${styles.formInput} ${styles.formInputReadonly}`}
                                                value="Present"
                                                readOnly
                                            />
                                        )}
                                        <label className={styles.checkboxLabel} style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={newExp.isPresent}
                                                onChange={(e) => setNewExp({ ...newExp, isPresent: e.target.checked })}
                                                style={{ accentColor: 'var(--color-gold)' }}
                                            />
                                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>I am currently working here</span>
                                        </label>
                                    </div>
                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className={styles.formLabel}>Description</label>
                                        <textarea 
                                            className={styles.formTextarea}
                                            placeholder="Describe your responsibilities and achievements... (max 200 chars)"
                                            maxLength={200}
                                            value={newExp.description}
                                            onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                                        />
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', float: 'right', marginTop: '4px' }}>
                                            {newExp.description.length}/200
                                        </span>
                                    </div>
                                    <div className={styles.editActions} style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                                        <button onClick={handleAddExp} className={styles.btnPrimary}>
                                            Save Experience
                                        </button>
                                        <button onClick={() => setExpFormOpen(false)} className={styles.btnOutlined}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                                <hr className={styles.divider} />
                            </div>
                        )}

                        {profile.experience.length === 0 && !expFormOpen ? (
                            <details className={styles.emptySectionDetails}>
                                <summary className={styles.emptySectionSummary}>
                                    No experience documented. Reveal to add your professional history or CTF participation.
                                </summary>
                                <div className={styles.emptySectionContent}>
                                    <div className={styles.emptyState}>
                                        <p>Document your career journey, internships, or relevant cyber projects.</p>
                                        <button onClick={() => setExpFormOpen(true)} className={styles.btnPrimary}>
                                            Add Experience
                                        </button>
                                    </div>
                                </div>
                            </details>
                        ) : profile.experience.length > 0 ? (
                            <div className={styles.list}>
                                {profile.experience.map((exp) => (
                                    <div key={exp.id} className={styles.listItem}>
                                        <div className={styles.itemContent}>
                                            <h4>{exp.position} at {exp.company}</h4>
                                            <p className={styles.date}>{exp.startDate} - {exp.endDate}</p>
                                            <p className={styles.description} style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>{exp.description}</p>
                                        </div>
                                        <button onClick={() => removeExperience(exp.id)} className={styles.btnOutlined} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </section>

                {/* Account Settings */}
                <details className={styles.settingsDetails}>
                    <summary className={styles.settingsSummary}>ACCOUNT_SETTINGS</summary>
                    <div className={styles.settingsContent}>
                        <div className={styles.settingGroup}>
                            <h3>Change Password</h3>
                            <div className={styles.formGrid}>
                                <div className="form-group">
                                    <label className={styles.formLabel}>Current Password</label>
                                    <input type="password" className={styles.formInput} placeholder="••••••••" />
                                </div>
                                <div className="form-group">
                                    <label className={styles.formLabel}>New Password</label>
                                    <input type="password" className={styles.formInput} placeholder="••••••••" />
                                </div>
                                <div className={styles.editActions} style={{ gridColumn: '1 / -1' }}>
                                    <button 
                                        className={styles.btnPrimary} 
                                        onClick={() => showToast('Password updated successfully', 'success')}
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.settingGroup}>
                            <h3>Notifications</h3>
                            <label className={styles.toggleLabel}>
                                <span>Platform Updates & Announcements</span>
                                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--color-gold)', transform: 'scale(1.2)' }} />
                            </label>
                            <label className={styles.toggleLabel}>
                                <span>Mission Reminders & Weekly Summary</span>
                                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--color-gold)', transform: 'scale(1.2)' }} />
                            </label>
                        </div>

                        <div className={styles.dangerZone}>
                            <h3>Danger Zone</h3>
                            <p>Once you delete your account, there is no going back. Please be certain.</p>
                            <div className={styles.editActions} style={{ justifyContent: 'flex-start' }}>
                                <button 
                                    className={styles.btnDanger}
                                    onClick={() => {
                                        if (confirm('Are you absolutely sure you want to completely erase your Operative Dossier? This cannot be undone.')) {
                                            showToast('Account scheduled for deletion', 'error');
                                        }
                                    }}
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </details>

            </div>

            {/* Confirmation Modal */}
            {roleModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>SWITCH SPECIALIZATION?</h3>
                        <p>Switching to <strong>{ROLE_OPTIONS.find(r => r.value === pendingRole)?.label}</strong> will reset your current pathway recommendations. This cannot be undone.</p>
                        <div className={styles.modalActions}>
                            <button className={styles.btnPrimary} onClick={confirmRoleSwitch}>CONFIRM SWITCH</button>
                            <button className={styles.btnOutlined} onClick={cancelRoleSwitch}>CANCEL</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
