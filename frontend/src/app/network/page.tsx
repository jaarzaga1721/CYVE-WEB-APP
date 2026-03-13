'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/config';
import OperativeDossierCard, { OperativeCardData } from '@/components/network/OperativeDossierCard';
import SignalFeed from '@/components/network/SignalFeed';
import PrivacySettings from '@/components/network/PrivacySettings';
import styles from './network.module.css';

type Tab = 'allies' | 'pending' | 'scan' | 'suggested' | 'privacy';
type TeamFilter = 'all' | 'red' | 'blue' | 'purple';

export default function NetworkPage() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('allies');
  const [allies, setAllies] = useState<OperativeCardData[]>([]);
  const [incoming, setIncoming] = useState<OperativeCardData[]>([]);
  const [outgoing, setOutgoing] = useState<OperativeCardData[]>([]);
  const [suggested, setSuggested] = useState<OperativeCardData[]>([]);
  const [searchResults, setSearchResults] = useState<OperativeCardData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState<TeamFilter>('all');
  const [loading, setLoading] = useState(false);

  const apiFetch = useCallback(async (path: string, opts?: RequestInit) => {
    const res = await fetch(`${API_BASE_URL}/${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...opts,
    });
    return res.json();
  }, []);

  const loadAllies = useCallback(async () => {
    setLoading(true);
    const data = await apiFetch('network/allies.php');
    if (data.success) setAllies(data.allies ?? []);
    setLoading(false);
  }, [apiFetch]);

  const loadPending = useCallback(async () => {
    setLoading(true);
    const data = await apiFetch('network/pending.php');
    if (data.success) {
      setIncoming(data.incoming ?? []);
      setOutgoing(data.outgoing ?? []);
    }
    setLoading(false);
  }, [apiFetch]);

  const loadSuggested = useCallback(async () => {
    setLoading(true);
    const data = await apiFetch('network/suggested.php');
    if (data.success) setSuggested(data.suggestions ?? []);
    setLoading(false);
  }, [apiFetch]);

  const doSearch = useCallback(async () => {
    if (!searchQuery.trim() && teamFilter === 'all') return;
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (teamFilter !== 'all') params.set('team', teamFilter);
    const data = await apiFetch(`network/scan.php?${params}`);
    if (data.success) setSearchResults(data.results ?? []);
    setLoading(false);
  }, [apiFetch, searchQuery, teamFilter]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === 'allies') loadAllies();
    if (activeTab === 'pending') loadPending();
    if (activeTab === 'suggested') loadSuggested();
  }, [activeTab, isAuthenticated, loadAllies, loadPending, loadSuggested]);

  // — Mutation helpers —
  const establishLink = async (targetId: number) => {
    await apiFetch('network/request.php', { method: 'POST', body: JSON.stringify({ receiver_id: targetId }) });
    if (activeTab === 'scan') doSearch();
    if (activeTab === 'suggested') loadSuggested();
  };

  const accept = async (linkId: number) => {
    await apiFetch('network/accept.php', { method: 'POST', body: JSON.stringify({ link_id: linkId }) });
    loadPending();
    loadAllies();
  };

  const decline = async (linkId: number) => {
    await apiFetch('network/decline.php', { method: 'POST', body: JSON.stringify({ link_id: linkId }) });
    loadPending();
  };

  const terminate = async (linkId: number) => {
    await apiFetch('network/terminate.php', { method: 'DELETE', body: JSON.stringify({ link_id: linkId }) });
    loadAllies();
  };

  const cancel = async (linkId: number) => {
    await apiFetch('network/terminate.php', { method: 'DELETE', body: JSON.stringify({ link_id: linkId }) });
    loadPending();
  };

  const TAB_LABELS: Record<Tab, string> = {
    allies:    `ALLIED OPERATIVES (${allies.length})`,
    pending:   `PENDING LINKS (${incoming.length + outgoing.length})`,
    scan:      'SCAN OPERATIVES',
    suggested: `SUGGESTED (${suggested.length})`,
    privacy:   'CLEARANCE SETTINGS'
  };

  const TEAM_FILTERS: { label: string; value: TeamFilter }[] = [
    { label: 'ALL TEAMS', value: 'all' },
    { label: 'RED UNIT', value: 'red' },
    { label: 'BLUE UNIT', value: 'blue' },
    { label: 'PURPLE UNIT', value: 'purple' },
  ];

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <div className={styles.noAuth}>
          <p>UNAUTHORIZED — Active session required to access Operative Grid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.terminalLine}>
            <span className={styles.prompt}>CYVE_OS://</span>
            <span className={styles.cmd}>operative_grid --mode=active</span>
          </p>
          <h1 className={styles.heroTitle}>OPERATIVE GRID</h1>
          <p className={styles.heroSub}>YOUR CONNECTED NETWORK</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.gridContainer}>
          <div className={styles.mainCol}>
            {/* Tab bar */}
            <div className={styles.tabBar}>
              {(Object.keys(TAB_LABELS) as Tab[]).map(tab => (
                <button
                  key={tab}
                  className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>

            {/* ── Tab 1: ALLIED OPERATIVES ── */}
            {activeTab === 'allies' && (
              <section className={styles.section}>
                {/* Sort filters */}
                <div className={styles.filterRow}>
                  {TEAM_FILTERS.map(f => (
                    <button
                      key={f.value}
                      className={`${styles.filterPill} ${teamFilter === f.value ? styles.filterPillActive : ''}`}
                      onClick={() => setTeamFilter(f.value)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <div className={styles.loadingState}>SCANNING OPERATIVE GRID...</div>
                ) : allies.length === 0 ? (
                  <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>◈</span>
                    <p className={styles.emptyTitle}>NO ALLIED OPERATIVES DETECTED.</p>
                    <p className={styles.emptyText}>Your operative grid is empty.</p>
                    <button className={styles.btnGold} onClick={() => setActiveTab('scan')}>
                      SCAN OPERATIVES →
                    </button>
                  </div>
                ) : (
                  <div className={styles.cardGrid}>
                    {allies
                      .filter(a => teamFilter === 'all' || a.team?.toLowerCase() === teamFilter)
                      .map(a => (
                        <OperativeDossierCard
                          key={a.id}
                          operative={a}
                          onTerminate={terminate}
                        />
                      ))}
                  </div>
                )}
              </section>
            )}

            {/* ── Tab 2: PENDING LINKS ── */}
            {activeTab === 'pending' && (
              <section className={styles.section}>
                {/* Incoming */}
                <div className={styles.subSection}>
                  <h3 className={styles.subHeading}>
                    INCOMING LINK REQUESTS ({incoming.length})
                  </h3>
                  {incoming.length === 0 ? (
                    <p className={styles.emptySmall}>NO INCOMING REQUESTS.</p>
                  ) : (
                    <div className={styles.cardGrid}>
                      {incoming.map(op => (
                        <OperativeDossierCard
                          key={op.id}
                          operative={op}
                          showAcceptDecline
                          onAccept={accept}
                          onDecline={decline}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Outgoing */}
                <div className={styles.subSection}>
                  <h3 className={styles.subHeading}>
                    OUTGOING REQUESTS ({outgoing.length})
                  </h3>
                  {outgoing.length === 0 ? (
                    <p className={styles.emptySmall}>NO OUTGOING REQUESTS.</p>
                  ) : (
                    <div className={styles.cardGrid}>
                      {outgoing.map(op => (
                        <OperativeDossierCard
                          key={op.id}
                          operative={op}
                          showCancel
                          onCancel={cancel}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ── Tab 3: SCAN OPERATIVES ── */}
            {activeTab === 'scan' && (
              <section className={styles.section}>
                <div className={styles.searchBox}>
                  <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Scan by agent name, skill, or team..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && doSearch()}
                  />
                  <button className={styles.btnScan} onClick={doSearch}>INITIATE SCAN</button>
                </div>

                {/* Filters */}
                <div className={styles.filterRow}>
                  {TEAM_FILTERS.map(f => (
                    <button
                      key={f.value}
                      className={`${styles.filterPill} ${teamFilter === f.value ? styles.filterPillActive : ''}`}
                      onClick={() => setTeamFilter(f.value)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <div className={styles.loadingState}>SCANNING...</div>
                ) : searchResults.length === 0 && searchQuery ? (
                  <div className={styles.emptyState}>
                    <span className={styles.errorTag}>[ERROR]</span>
                    <p className={styles.emptyTitle}>No operatives found matching scan parameters.</p>
                    <p className={styles.emptyText}>Adjust filters and retry.</p>
                  </div>
                ) : (
                  <div className={styles.cardGrid}>
                    {searchResults.map(op => (
                      <OperativeDossierCard
                        key={op.id}
                        operative={op}
                        onEstablishLink={establishLink}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ── Tab 4: SUGGESTED OPERATIVES ── */}
            {activeTab === 'suggested' && (
              <section className={styles.section}>
                {loading ? (
                  <div className={styles.loadingState}>ANALYZING OPERATIVE PROFILES...</div>
                ) : suggested.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p className={styles.emptyTitle}>NO SUGGESTIONS AVAILABLE.</p>
                    <p className={styles.emptyText}>Expand your team assignments and return.</p>
                  </div>
                ) : (
                  <div className={styles.cardGrid}>
                    {suggested.map(op => (
                      <OperativeDossierCard
                        key={op.id}
                        operative={op}
                        onEstablishLink={establishLink}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
            {/* ── Tab 5: CLEARANCE SETTINGS ── */}
            {activeTab === 'privacy' && (
              <section className={styles.section}>
                <PrivacySettings />
              </section>
            )}
          </div>

          {/* Sidebar: Signal Feed */}
          <aside className={styles.sidebar}>
            <div className={styles.subHeading}>LIVE_SIGNALS</div>
            <SignalFeed />
          </aside>
        </div>
      </div>
    </div>
  );
}
