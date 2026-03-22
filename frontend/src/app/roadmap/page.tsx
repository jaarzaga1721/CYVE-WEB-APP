'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/app/Homepage/components/ProtectedRoute';
import { useProfile, type PreferredRole } from '@/context/ProfileContext';
import { useRoadmap, type RoadmapStep } from '@/context/RoadmapContext';
import { ROLE_TIMELINES, ROLE_COMPANIES, ROLE_TITLES, ROLE_OVERVIEW, ROLE_SKILLS, ROLE_CERTIFICATIONS, STEP_EXTRA, type RoleKey } from './roadmapData';
import RoadmapMap from '@/app/Homepage/components/RoadmapMap';
import styles from './roadmap.module.css';

import {
  GamepadIcon,
  GraduationIcon,
  SecurityIcon,
  SkullIcon,
  TargetIcon,
  ShieldIcon,
  MergeIcon
} from '@/app/Homepage/components/Icons';

function StepIcon({ type }: { type: string }) {
  const size = 32;
  const color = '#f5be1e';

  switch (type) {
    case 'game':
      return <GamepadIcon width={size} height={size} color={color} />;
    case 'foundations':
      return <GraduationIcon width={size} height={size} color={color} />;
    case 'defensive':
      return <SecurityIcon width={size} height={size} color={color} />;
    case 'offensive':
      return <SkullIcon width={size} height={size} color={color} />;
    default:
      return null;
  }
}

export default function RoadmapPage() {
  return (
    <ProtectedRoute>
      <RoadmapContent />
    </ProtectedRoute>
  );
}

function RoadmapContent() {
  const { profile, updateProfile } = useProfile();
  const { steps, selectedField, selectField, toggleStepCompletion, getProgress } = useRoadmap();
  const [isSwitching, setIsSwitching] = useState(false);
  const [showUplink, setShowUplink] = useState(false);
  const [lastCompletedTask, setLastCompletedTask] = useState<string | null>(null);

  const role: RoleKey | null = isSwitching ? null : (profile.preferredRole ?? selectedField);

  // Uplink effect on role change
  useEffect(() => {
    if (role && !isSwitching) {
        setShowUplink(true);
        const timer = setTimeout(() => setShowUplink(false), 1500);
        return () => clearTimeout(timer);
    }
  }, [role, isSwitching]);

  useEffect(() => {
    if (profile.preferredRole && profile.preferredRole !== selectedField && !isSwitching) {
      selectField(profile.preferredRole);
    }
  }, [profile.preferredRole, selectedField, selectField, isSwitching]);

  const handleRoleSelect = (r: PreferredRole) => {
    updateProfile({ preferredRole: r });
    selectField(r);
    setIsSwitching(false);
  };

  const handleToggle = (stepId: string, title: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step && !step.completed) {
        setLastCompletedTask(title);
        setTimeout(() => setLastCompletedTask(null), 3000);
    }
    toggleStepCompletion(stepId);
  };

  if (role === null) {
    return (
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.hexPattern} aria-hidden />
          <h1 className={styles.mainTitle}>CHOOSE YOUR PATH</h1>
          <p className={styles.choosePathHint}>
            To build your custom roadmap, select the specialization that matches your career objectives within the cybersecurity ecosystem.
          </p>
          <div className={styles.roleSelector}>
            <button type="button" onClick={() => handleRoleSelect('red')} className={styles.roleBtn}>
              <span className={styles.roleBtnIcon}>
                <TargetIcon width={48} height={48} color="#f5a623" />
              </span>
              <span className={styles.roleBtnLabel} style={{ color: '#e05252' }}>Red Team</span>
              <span className={styles.roleBtnDesc}>Offensive Security: Penetration testing, exploit development, and simulation.</span>
            </button>
            <button type="button" onClick={() => handleRoleSelect('blue')} className={styles.roleBtn}>
              <span className={styles.roleBtnIcon}>
                <ShieldIcon width={48} height={48} color="#f5a623" />
              </span>
              <span className={styles.roleBtnLabel} style={{ color: '#4a9eff' }}>Blue Team</span>
              <span className={styles.roleBtnDesc}>Defensive Security: Threat detection, incident response, and infrastructure protection.</span>
            </button>
            <button type="button" onClick={() => handleRoleSelect('purple')} className={styles.roleBtn}>
              <span className={styles.roleBtnIcon}>
                <MergeIcon width={48} height={48} color="#f5a623" />
              </span>
              <span className={styles.roleBtnLabel} style={{ color: '#9b59f5' }}>Purple Team</span>
              <span className={styles.roleBtnDesc}>Hybrid Strategy: Bridging the gap between offensive and defensive operations.</span>
            </button>
          </div>
        </section>
      </div>
    );
  }

  const timeline = ROLE_TIMELINES[role];
  const companies = ROLE_COMPANIES[role];
  const roleTitle = ROLE_TITLES[role];
  const stepsMap = new Map(steps.map(s => [s.id, s]));

  const firstIncompleteIndex = steps.findIndex(s => !s.completed);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.hexPattern} aria-hidden />
        <h1 className={styles.mainTitle}>ROADMAP</h1>
        <p className={styles.roleSubtitle}>{roleTitle}</p>
        <div className={styles.heroActions}>
          <button className={styles.changeRoleBtn} onClick={() => setIsSwitching(true)}>
            Change Specialization
          </button>
        </div>
        <div className={styles.progressWrap}>
          <span className={styles.progressLabel}>Current Operative Progress</span>
          {getProgress() === 0 ? (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '3px solid #f5a623', textAlign: 'center' }}>
                <p style={{ color: '#fff', margin: '0 0 1rem 0' }}>Your mission hasn&apos;t started yet.</p>
                <button 
                  onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })} 
                  className={styles.changeRoleBtn} 
                  style={{ display: 'inline-block' }}
                >
                  Begin Mission →
                </button>
            </div>
          ) : (
            <>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${getProgress()}%` }} />
              </div>
              <span className={styles.progressPercent}>{getProgress()}%</span>
            </>
          )}
        </div>
      </section>

      <section className={styles.overviewSection}>
        <h2 className={styles.overviewTitle}>
            {role === 'red' ? 'RED TEAM OPERATIVE BRIEF' : role === 'blue' ? 'BLUE TEAM DEFENSIVE BRIEF' : 'PURPLE TEAM HYBRID BRIEF'}
        </h2>
        <p className={styles.overviewText}>{ROLE_OVERVIEW[role]}</p>
      </section>

      <section className={styles.skillsCertSection}>
        <div className={styles.skillsCertGrid}>
          <div className={styles.skillsCertCard}>
            <h3 className={styles.skillsCertHeading}>Skills you&apos;ll gain</h3>
            <div className={styles.skillsGrid}>
              {ROLE_SKILLS[role].map((skill, i) => (
                <div key={i} className={styles.skillBox}>
                    <div className={styles.skillIcon}>◈</div>
                    <div className={styles.skillLabel}>{skill}</div>
                    <div className={styles.skillBar}><div className={styles.skillFill} style={{ width: '0%', animation: 'fillSkill 1.5s ease-out forwards', animationDelay: `${i * 0.1}s` }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.skillsCertCard}>
            <h3 className={styles.skillsCertHeading}>Certifications to consider</h3>
            <ul className={styles.skillsList}>
              {ROLE_CERTIFICATIONS[role].map((cert, i) => {
                const upper = cert.toUpperCase();
                let badgeBg = '';
                let badgeColor = '';
                let badgeText = '';
                
                if (upper.includes('COMPTIA') || upper.includes('EJPT')) { 
                    badgeBg = 'rgba(76, 175, 80, 0.2)'; badgeColor = '#4caf50'; badgeText = 'Beginner'; 
                } else if (upper.includes('CEH') || upper.includes('PNPT')) { 
                    badgeBg = 'rgba(245, 166, 35, 0.2)'; badgeColor = '#f5a623'; badgeText = 'Intermediate'; 
                } else if (upper.includes('OSCP')) { 
                    badgeBg = 'rgba(229, 57, 53, 0.2)'; badgeColor = '#e53935'; badgeText = 'Advanced'; 
                }

                return (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {cert}
                    </span>
                    {badgeText && (
                      <span style={{ 
                        backgroundColor: badgeBg, color: badgeColor, 
                        border: `1px solid ${badgeColor}`, borderRadius: '12px', 
                        padding: '2px 8px', fontSize: '0.7rem', fontWeight: 'bold' 
                      }}>
                        {badgeText}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.timelineSection}>
        <div className={styles.timeline}>
          {timeline.map((config, index) => (
            <div key={config.stepLabel + index} className={styles.step}>
              <span className={styles.stepLabel}>{config.stepLabel}</span>
              <span className={styles.stepSubtitle}>{config.subtitle}</span>
              <div className={styles.stepIcon}>
                <StepIcon type={config.icon} />
              </div>
              <div className={styles.stepContentBlocks}>
                {config.stepIds.map(stepId => {
                  const step = stepsMap.get(stepId);
                  const extra = STEP_EXTRA[stepId];
                  if (!step) return <div key={stepId} className={styles.contentBlock} />;
                  
                  const stepIndex = steps.findIndex(s => s.id === step.id);
                  const isLocked = firstIncompleteIndex !== -1 && stepIndex > firstIncompleteIndex;
                  const isActive = stepIndex === firstIncompleteIndex;

                  return (
                    <ContentBlock 
                      key={step.id} 
                      step={step} 
                      extra={extra} 
                      isLocked={isLocked}
                      isActive={isActive}
                      onToggle={() => handleToggle(step.id, step.title)} 
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Uplink Overlay */}
        {showUplink && (
            <div className={styles.uplinkOverlay}>
                <div className={styles.uplinkBox}>
                    <div className={styles.glitchText} data-text="ESTABLISHING_UPLINK">ESTABLISHING_UPLINK</div>
                    <div className={styles.uplinkSub}>{role.toUpperCase()}_SECTOR // ACCESS_GRANTED</div>
                    <div className={styles.uplinkSync}>SYNC: 0x{Math.random().toString(16).slice(2, 8).toUpperCase()}</div>
                </div>
            </div>
        )}

        {/* Achievement HUD */}
        {lastCompletedTask && (
            <div className={styles.achievementHUD}>
                <div className={styles.achievementBox}>
                    <div className={styles.achIcon}>✓</div>
                    <div className={styles.achMeta}>
                        <div className={styles.achTitle}>OBJECTIVE_SECURED</div>
                        <div className={styles.achTask}>{lastCompletedTask}</div>
                    </div>
                </div>
            </div>
        )}
      </section>

      <section className={styles.mapSection}>
        <p className={styles.mapSectionLabel}>Career map — recommended companies by location</p>
        <RoadmapMap companies={companies} />
      </section>

      <section className={styles.companiesSection}>
        <h2 className={styles.companiesTitle}>RECOMMENDED COMPANIES</h2>
        <p className={styles.companiesSubtitle}>Companies hiring for {role === 'red' ? 'offensive' : role === 'blue' ? 'defensive' : 'hybrid'} security roles</p>
        <div className={styles.companiesList}>
          {companies.map((company, i) => (
            <div key={i} className={styles.companyCard}>
              <p className={styles.companyName}>{company.name}</p>
              <p className={styles.companyAddress}>{company.address}</p>
              <p className={styles.companyDescription}>{company.description}</p>
              {company.roles && company.roles.length > 0 && (
                <p className={styles.companyRoles}>
                  <strong>Example roles:</strong> {company.roles.join(' · ')}
                </p>
              )}
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className={styles.companyLink}>
                  Learn more & careers →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ContentBlock({
  step,
  extra,
  isLocked,
  isActive,
  onToggle,
}: {
  step: RoadmapStep;
  extra?: { duration: string; skills: string[]; resources: { label: string; url: string }[] };
  isLocked: boolean;
  isActive: boolean;
  onToggle: () => void;
}) {
  let blockClass = styles.contentBlock;
  if (step.completed) blockClass = `${styles.contentBlock} ${styles.contentBlockDone}`;
  else if (isLocked) blockClass = `${styles.contentBlock} ${styles.contentBlockLocked}`;
  else if (isActive) blockClass = `${styles.contentBlock} ${styles.contentBlockActive}`;

  return (
    <div className={blockClass}>
      <div className={styles.contentBlockInner}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.contentBlockTitle}>{step.title}</span>
            {isLocked && <span style={{ fontSize: '1.2rem', opacity: 0.5 }} title="Locked">🔒</span>}
        </div>
        <p className={styles.contentBlockDesc}>{step.description}</p>
        {extra && (
          <>
            <p className={styles.contentBlockMeta}><strong>Duration:</strong> {extra.duration}</p>
            {extra.skills.length > 0 && (
              <p className={styles.contentBlockMeta}><strong>Skills:</strong> {extra.skills.join(', ')}</p>
            )}
            {extra.resources.length > 0 && (
              <div className={styles.contentBlockResources}>
                <strong>Resources:</strong>
                <ul>
                  {extra.resources.map((r, i) => (
                    <li key={i}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>
                        {r.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
        {!isLocked && (
          <button
            type="button"
            onClick={onToggle}
            className={step.completed ? styles.btnCompleteDone : styles.btnComplete}
          >
            {step.completed ? '✓ Completed' : 'Mark complete'}
          </button>
        )}
        {isLocked && <span className={styles.lockedLabel}>[ LOCKED ]</span>}
      </div>
    </div>
  );
}
