'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';
import styles from './SignalFeed.module.css';

interface SignalEvent {
  id: number;
  user_id: number;
  display_name: string;
  team: string | null;
  rank: string | null;
  event_type: string;
  event_data: any;
  created_at: string;
}

export default function SignalFeed() {
  const [events, setEvents] = useState<SignalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/network/feed.php?filter=all`, { 
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
      const data = await res.json();
      if (data.success) setEvents(data.events ?? []);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 45000); // refresh every 45s
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderEventMessage = (ev: SignalEvent) => {
    const teamLabel = ev.team ? `[${ev.team.toUpperCase()}] ` : '';
    switch (ev.event_type) {
      case 'link_established':
        return (
          <span className={styles.msgActive}>
            Established Neural Link with <span className={styles.highlight}>{ev.event_data.with_name || 'Allied Operative'}</span>
          </span>
        );
      case 'promotion_received':
        return (
          <span className={styles.msgPromo}>
            Rank upgrade detected: <span className={styles.highlight}>{ev.rank}</span>
          </span>
        );
      case 'operative_commenced':
        return (
          <span className={styles.msgSystem}>
             Operative active in grid context.
          </span>
        );
      default:
        return <span>Activity detected in grid sector.</span>;
    }
  };

  return (
    <div className={styles.feed}>
      <div className={styles.header}>
        <div className={styles.scanLine} />
        <h3 className={styles.title}>SIGNAL_FEED v1.0</h3>
        <p className={styles.status}>// GRID_INTEL_ACTIVE</p>
      </div>

      <div className={styles.terminal}>
        {loading && events.length === 0 ? (
          <p className={styles.loading}>SYNCING SIGNALS...</p>
        ) : events.length === 0 ? (
          <p className={styles.empty}>NO SIGNALS DETECTED IN LOCAL SECTOR.</p>
        ) : (
          events.map(ev => (
            <div key={ev.id} className={styles.logLine}>
              <span className={styles.timestamp}>[{formatTimestamp(ev.created_at)}]</span>
              <span className={styles.agentInfo} style={{ color: getTeamColor(ev.team) }}>
                {ev.display_name}:
              </span>
              <div className={styles.message}>
                {renderEventMessage(ev)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function getTeamColor(team: string | null) {
  if (!team) return '#888';
  const colors: Record<string, string> = {
    'red': '#e05252',
    'blue': '#4a9eff',
    'purple': '#9b59f5'
  };
  return colors[team.toLowerCase()] || '#888';
}
