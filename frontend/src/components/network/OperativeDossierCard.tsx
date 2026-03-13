'use client';

import styles from './OperativeDossierCard.module.css';

export type LinkStatus =
  | 'not_connected'
  | 'pending_outgoing'
  | 'pending_incoming'
  | 'active'
  | 'classified';

export interface OperativeCardData {
  id: number;
  display_name: string;
  team?: string | null;
  rank?: string | null;
  skills?: string[];
  progress_percent?: number | null;
  xp?: number;
  link_id?: number | null;
  link_status: LinkStatus;
  dossier_visibility?: string;
  suggestion_reason?: string;
  shared_allies?: number;
}

interface Props {
  operative: OperativeCardData;
  onEstablishLink?: (id: number) => void;
  onAccept?: (linkId: number) => void;
  onDecline?: (linkId: number) => void;
  onTerminate?: (linkId: number) => void;
  onCancel?: (linkId: number) => void;
  showAcceptDecline?: boolean;
  showCancel?: boolean;
}

const TEAM_COLORS: Record<string, string> = {
  'red':    '#e05252',
  'blue':   '#4a9eff',
  'purple': '#9b59f5',
};

const TEAM_LABELS: Record<string, string> = {
  'red':    'RED UNIT',
  'blue':   'BLUE UNIT',
  'purple': 'PURPLE UNIT',
};

export default function OperativeDossierCard({
  operative,
  onEstablishLink,
  onAccept,
  onDecline,
  onTerminate,
  onCancel,
  showAcceptDecline = false,
  showCancel = false,
}: Props) {
  const teamKey = operative.team?.toLowerCase() ?? '';
  const teamColor = TEAM_COLORS[teamKey] ?? '#888888';
  const teamLabel = TEAM_LABELS[teamKey] ?? operative.team?.toUpperCase() ?? 'UNASSIGNED';
  const initials = operative.display_name.charAt(0).toUpperCase();
  const isClassified = operative.dossier_visibility === 'classified';

  return (
    <div className={styles.card}>
      {/* Suggestion reason */}
      {operative.suggestion_reason && (
        <p className={styles.suggestionReason}>
          SUGGESTED BECAUSE: {operative.suggestion_reason}
        </p>
      )}

      {/* Header: Avatar + Name */}
      <div className={styles.cardHeader}>
        <div
          className={styles.avatar}
          style={{ borderColor: teamColor }}
        >
          {initials}
        </div>
        <div className={styles.identity}>
          <span className={styles.displayName}>{operative.display_name}</span>
          <div className={styles.badges}>
            {operative.team && (
              <span className={styles.teamPill} style={{ color: teamColor, borderColor: teamColor }}>
                {teamLabel}
              </span>
            )}
            {operative.rank && (
              operative.rank === 'CLASSIFIED' ? (
                <span className={styles.restrictedBadge}>RESTRICTED CLEARANCE</span>
              ) : (
                <span className={styles.rankBadge}>{operative.rank}</span>
              )
            )}
          </div>
        </div>
      </div>

      {isClassified ? (
        <div className={styles.classifiedBanner}>
          <span>⚠</span>
          <div>
            <strong>DOSSIER CLASSIFIED</strong>
            <p>This operative has restricted their profile.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Divider */}
          <div className={styles.divider} />

          {/* Skills */}
          {operative.skills && operative.skills.length > 0 && (
            <div className={styles.skills}>
              {operative.skills.map((skill, i) => (
                <span key={i} className={styles.skillPill}>{skill}</span>
              ))}
            </div>
          )}

          {/* Progress */}
          {operative.progress_percent != null && (
            <div className={styles.progressRow}>
              <span className={styles.progressLabel}>PROGRESS</span>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${operative.progress_percent}%` }}
                />
              </div>
              <span className={styles.progressPct}>{operative.progress_percent}%</span>
            </div>
          )}

          {/* Shared allies / Mutual links */}
          {operative.shared_allies != null && operative.shared_allies > 0 && (
            <div className={styles.sharedAllies}>
              <span className={styles.sharedIcon}>◈</span>
              <span>{operative.shared_allies} MUTUAL CONNECTIONS</span>
            </div>
          )}

          {/* Divider */}
          <div className={styles.divider} />
        </>
      )}

      {/* Connection action buttons */}
      <div className={styles.actions}>
        {operative.link_status === 'not_connected' && (
          <button
            className={styles.btnEstablish}
            onClick={() => onEstablishLink?.(operative.id)}
          >
            ESTABLISH LINK
          </button>
        )}

        {operative.link_status === 'pending_outgoing' && (
          <div className={styles.actionsRow}>
            <button className={styles.btnPending} disabled>
              LINK PENDING...
            </button>
            {showCancel && operative.link_id && (
              <button
                className={styles.btnCancel}
                onClick={() => onCancel?.(operative.link_id!)}
              >
                CANCEL ×
              </button>
            )}
          </div>
        )}

        {operative.link_status === 'pending_incoming' && showAcceptDecline && operative.link_id && (
          <div className={styles.actionsRow}>
            <button
              className={styles.btnAccept}
              onClick={() => onAccept?.(operative.link_id!)}
            >
              ACCEPT LINK ✓
            </button>
            <button
              className={styles.btnDecline}
              onClick={() => onDecline?.(operative.link_id!)}
            >
              DECLINE
            </button>
          </div>
        )}

        {operative.link_status === 'pending_incoming' && !showAcceptDecline && (
          <button className={styles.btnPending} disabled>LINK PENDING...</button>
        )}

        {operative.link_status === 'active' && (
          <div className={styles.btnActiveWrapper}>
            <button className={styles.btnActive}>✓ LINK ACTIVE</button>
            {operative.link_id && (
              <button
                className={styles.btnTerminate}
                onClick={() => onTerminate?.(operative.link_id!)}
              >
                TERMINATE LINK
              </button>
            )}
          </div>
        )}

        {operative.link_status === 'classified' && (
          <button className={styles.btnClassified} disabled>
            DOSSIER CLASSIFIED
          </button>
        )}
      </div>
    </div>
  );
}
