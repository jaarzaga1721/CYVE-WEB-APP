'use client';

import { useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../config';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/request_reset.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage(data.message);
            } else {
                setError(data.message || 'Something went wrong.');
            }
        } catch {
            setError('NETWORK_ERROR // Could not reach the server. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={pageStyle}>
            {/* Grid background */}
            <div style={gridBg} />

            <div style={cardStyle}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <div style={logoStyle}>CYVE</div>
                    </Link>
                    <div style={terminalLineStyle}>
                        <span style={{ color: '#f5a623' }}>$</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: '0.5rem' }}>initiate_password_recovery</span>
                    </div>
                    <h1 style={titleStyle}>CREDENTIAL_RECOVERY</h1>
                    <p style={subtitleStyle}>Enter your operative email to receive a secure reset transmission.</p>
                </div>

                {message && (
                    <div style={{ ...alertBase, borderColor: '#4caf50', background: 'rgba(76,175,80,0.08)', color: '#4caf50', marginBottom: '1.5rem' }}>
                        ✓ {message}
                    </div>
                )}
                {error && (
                    <div style={{ ...alertBase, borderColor: '#e05252', background: 'rgba(224,82,82,0.08)', color: '#ff6666', marginBottom: '1.5rem' }}>
                        ✗ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>OPERATIVE_EMAIL</label>
                        <input
                            type="email"
                            style={inputStyle}
                            placeholder="operative@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            onFocus={(e) => { e.target.style.borderColor = '#f5a623'; }}
                            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...btnStyle,
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                        onMouseEnter={(e) => { if (!loading) (e.target as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(245,166,35,0.3)'; }}
                        onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.boxShadow = 'none'; }}
                    >
                        {loading ? 'TRANSMITTING...' : 'TRANSMIT_RESET_LINK →'}
                    </button>
                </form>

                <div style={footerStyle}>
                    <Link href="/login" style={linkStyle}>← RETURN_TO_ACCESS</Link>
                    <Link href="/signup" style={linkStyle}>NEW_OPERATIVE →</Link>
                </div>
            </div>
        </div>
    );
}

// Inline styles
const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
};

const gridBg: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundImage: 'linear-gradient(rgba(245,166,35,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.03) 1px, transparent 1px)',
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
};

const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '440px',
    background: 'rgba(12,12,12,0.98)',
    border: '1px solid rgba(245,166,35,0.25)',
    borderRadius: '4px',
    padding: '3rem 2.5rem',
    boxShadow: '0 0 40px rgba(245,166,35,0.06), 0 20px 60px rgba(0,0,0,0.7)',
    position: 'relative',
};

const logoStyle: React.CSSProperties = {
    fontSize: '1.8rem',
    fontWeight: 900,
    color: '#f5a623',
    letterSpacing: '6px',
    textShadow: '0 0 20px rgba(245,166,35,0.3)',
    marginBottom: '1rem',
    display: 'block',
};

const terminalLineStyle: React.CSSProperties = {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.72rem',
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '3px',
    padding: '0.35rem 0.75rem',
    display: 'inline-flex',
    alignItems: 'center',
    marginBottom: '1.25rem',
};

const titleStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: 900,
    color: '#fff',
    letterSpacing: '3px',
    margin: '0 0 0.5rem',
};

const subtitleStyle: React.CSSProperties = {
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '0.5px',
    lineHeight: 1.6,
    margin: 0,
};

const alertBase: React.CSSProperties = {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.78rem',
    padding: '0.85rem 1rem',
    borderRadius: '3px',
    border: '1px solid',
    letterSpacing: '0.5px',
    lineHeight: 1.5,
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.6rem',
    fontWeight: 900,
    letterSpacing: '2px',
    color: '#f5a623',
    fontFamily: "'Courier New', monospace",
    marginBottom: '0.5rem',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '3px',
    color: '#fff',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    padding: '0.75rem 1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box',
};

const btnStyle: React.CSSProperties = {
    width: '100%',
    background: '#f5a623',
    color: '#000',
    fontWeight: 900,
    fontSize: '0.72rem',
    letterSpacing: '2px',
    border: 'none',
    borderRadius: '3px',
    padding: '0.9rem',
    transition: 'all 0.3s',
};

const footerStyle: React.CSSProperties = {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
};

const linkStyle: React.CSSProperties = {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '1.5px',
    color: 'rgba(255,255,255,0.35)',
    textDecoration: 'none',
    fontFamily: "'Courier New', monospace",
    transition: 'color 0.2s',
};
