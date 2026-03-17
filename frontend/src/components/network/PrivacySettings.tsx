'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';
import styles from './PrivacySettings.module.css';

interface PrivacySettings {
  dossier_visibility: 'public' | 'unit_only' | 'allies_only' | 'classified';
  show_progress: boolean;
  show_skills: boolean;
  show_rank: boolean;
  allow_links: boolean;
}

export default function PrivacySettings() {
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/network/privacy.php`, { credentials: 'include' });
        const data = await res.json();
        if (data.success) {
          setSettings({
            dossier_visibility: data.dossier_visibility,
            show_progress: Boolean(data.show_progress),
            show_skills: Boolean(data.show_skills),
            show_rank: Boolean(data.show_rank),
            allow_links: Boolean(data.allow_links),
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async (newSettings: PrivacySettings) => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/network/privacy.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('CLEARANCE UPDATED. DATA ENCRYPTED.');
        setSettings(newSettings);
      } else {
        setMessage('ERROR: FAILED TO UPDATE CLEARANCE.');
      }
    } catch {
      setMessage('ERROR: SIGNAL TIMEOUT.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loading}>DECRYPTING PRIVACY LAYER...</div>;
  if (!settings) return <div className={styles.error}>FAILED TO LOAD CLEARANCE PROTOCOLS.</div>;

  const updateField = (field: keyof PrivacySettings, value: any) => {
    const next = { ...settings, [field]: value };
    saveSettings(next);
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h4 className={styles.heading}>DOSSIER_ACCESS_LEVEL</h4>
        <p className={styles.description}>Who can scan your operative profile in the grid?</p>
        
        <div className={styles.radioGroup}>
          {[
            { id: 'public', label: 'PUBLIC (GRID_SCAN)' },
            { id: 'unit_only', label: 'UNIT_ONLY (TEAM)' },
            { id: 'allies_only', label: 'ALLIES_ONLY (NEURAL_LINKS)' },
            { id: 'classified', label: 'CLASSIFIED (TOP_SECRET)' },
          ].map(opt => (
            <label key={opt.id} className={`${styles.radioLabel} ${settings.dossier_visibility === opt.id ? styles.active : ''}`}>
              <input
                type="radio"
                name="visibility"
                checked={settings.dossier_visibility === opt.id}
                onChange={() => updateField('dossier_visibility', opt.id)}
              />
              <span className={styles.radioText}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <h4 className={styles.heading}>DATA_TRANSMISSION_PROTOCOL</h4>
        <p className={styles.description}>Toggle specific data exposure for authorized scans.</p>

        <div className={styles.toggleGroup}>
          {[
            { id: 'show_rank', label: 'TRANSMIT RANK DATA' },
            { id: 'show_skills', label: 'TRANSMIT SKILLSET' },
            { id: 'show_progress', label: 'TRANSMIT PROGRESS METRICS' },
            { id: 'allow_links', label: 'ALLOW NEURAL LINK REQUESTS' },
          ].map(opt => (
            <label key={opt.id} className={styles.toggleLabel}>
              <span className={styles.toggleText}>{opt.label}</span>
              <div className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings[opt.id as keyof PrivacySettings] as boolean}
                  onChange={(e) => updateField(opt.id as keyof PrivacySettings, e.target.checked)}
                />
                <span className={styles.slider} />
              </div>
            </label>
          ))}
        </div>
      </div>

      {message && <div className={styles.statusMsg}>{message}</div>}
      {saving && <div className={styles.savingMsg}>SAVING...</div>}
    </div>
  );
}
