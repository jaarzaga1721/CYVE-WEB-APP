'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';

export default function SetOperativeNameModal() {
    const { user, setUser } = useAuth();
    const { callApi, loading } = useApi();
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (!user || user.display_name) return null;

    const handleSubmit = async (name: string) => {
        const result = await callApi('update_profile_name.php', {
            method: 'POST',
            body: JSON.stringify({ display_name: name })
        });

        if (result.success) {
            const updatedUser = { ...user, display_name: name, name: name };
            setUser(updatedUser);
            localStorage.setItem('cyve_user', JSON.stringify(updatedUser));
        } else {
            setError(result.message || 'Failed to establish identity.');
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{
                background: '#1a1a1a', border: '1px solid rgba(245,166,35,0.3)',
                borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '400px',
                boxShadow: '0 0 40px rgba(245,166,35,0.1)'
            }}>
                <h2 style={{ 
                    color: '#f5a623', marginBottom: '24px', letterSpacing: '0.1em',
                    borderLeft: '3px solid #f5a623', paddingLeft: '12px', textTransform: 'uppercase'
                }}>Set Operative Name</h2>
                <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>
                    Welcome back, operative. Establish your unique designation within the CYVE network to proceed.
                </p>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: '#f5a623', display: 'block', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Agent Designation
                    </label>
                    <input 
                        type="text" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Ghost, Cipher"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                    {error && <p style={{ color: '#e53935', fontSize: '12px', marginTop: '8px' }}>[ERROR] {error}</p>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button 
                        onClick={() => handleSubmit(displayName)}
                        disabled={loading || !displayName.trim()}
                        style={{
                            background: '#f5a623', color: '#0a0a0a', fontWeight: 'bold',
                            borderRadius: '6px', padding: '12px', textTransform: 'uppercase',
                            cursor: loading ? 'not-allowed' : 'pointer', opacity: (loading || !displayName.trim()) ? 0.6 : 1
                        }}
                    >
                        {loading ? 'Establishing...' : 'Confirm Identity'}
                    </button>
                    <button 
                        onClick={() => handleSubmit(String(user.username))}
                        style={{
                            background: 'transparent', color: '#888',
                            fontSize: '13px', cursor: 'pointer'
                        }}
                    >
                        Use default designation
                    </button>
                </div>
            </div>
        </div>
    );
}
