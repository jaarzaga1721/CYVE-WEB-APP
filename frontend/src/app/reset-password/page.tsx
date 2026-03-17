'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '../../config';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [strength, setStrength] = useState(0);

    useEffect(() => {
        if (!token) setError('INVALID_TOKEN // Reset link is missing or expired.');
    }, [token]);

    const evaluateStrength = (pw: string) => {
        let score = 0;
        if (pw.length >= 8) score++;
        if (pw.length >= 12) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        setStrength(score);
    };

    const strengthLabels = ['', 'WEAK', 'FAIR', 'MODERATE', 'STRONG', 'MAXIMUM'];
    const strengthColors = ['', '#e05252', '#f5a623', '#f5d623', '#4caf50', '#00ff88'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('PASSWORD_MISMATCH // Credentials do not match. Retry.');
            return;
        }

        if (password.length < 8) {
            setError('INSUFFICIENT_LENGTH // Minimum 8 characters required.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/reset_password.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage(data.message);
                setTimeout(() => router.push('/login'), 3000);
            } else {
                setError(data.message || 'Reset failed. Token may be expired.');
            }
        } catch {
            setError('NETWORK_ERROR // Could not reach the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={cardStyle}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <div style={logoStyle}>CYVE</div>
                </Link>
                <div style={terminalLineStyle}>
                    <span style={{ color: '#f5a623' }}>$</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: '0.5rem' }}>set_new_credentials --secure</span>
                </div>
                <h1 style={titleStyle}>SET_NEW_CREDENTIALS</h1>
                <p style={subtitleStyle}>Establish a new secure access key for your operative account.</p>
            </div>

            {message && (
                <div style={{ ...alertBase, borderColor: '#4caf50', background: 'rgba(76,175,80,0.08)', color: '#4caf50', marginBottom: '1.5rem' }}>
                    ✓ {message} — Redirecting to login...
                </div>
            )}
            {error && (
                <div style={{ ...alertBase, borderColor: '#e05252', background: 'rgba(224,82,82,0.08)', color: '#ff6666', marginBottom: '1.5rem' }}>
                    ✗ {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={labelStyle}>NEW_PASSKEY</label>
                    <input
                        type="password"
                        style={inputStyle}
                        placeholder="Min 8 characters"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); evaluateStrength(e.target.value); }}
                        required
                        onFocus={(e) => { e.target.style.borderColor = '#f5a623'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    />
                    {/* Strength meter */}
                    {password && (
                        <div style={{ marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '3px', marginBottom: '3px' }}>
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} style={{
                                        flex: 1, height: '3px', borderRadius: '2px',
                                        background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.1)',
                                        transition: 'background 0.3s',
                                    }} />
                                ))}
                            </div>
                            <span style={{ fontSize: '0.55rem', letterSpacing: '1.5px', color: strengthColors[strength], fontFamily: "'Courier New', monospace" }}>
                                STRENGTH: {strengthLabels[strength]}
                            </span>
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>CONFIRM_PASSKEY</label>
                    <input
                        type="password"
                        style={{
                            ...inputStyle,
                            borderColor: confirmPassword && password !== confirmPassword ? '#e05252' : (confirmPassword && password === confirmPassword ? '#4caf50' : 'rgba(255,255,255,0.1)'),
                        }}
                        placeholder="Re-enter your new pass key"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        onFocus={(e) => { e.target.style.borderColor = '#f5a623'; }}
                        onBlur={(e) => {
                            e.target.style.borderColor = confirmPassword && password !== confirmPassword ? '#e05252' : (confirmPassword && password === confirmPassword ? '#4caf50' : 'rgba(255,255,255,0.1)');
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !token}
                    style={{
                        ...btnStyle,
                        opacity: loading || !token ? 0.5 : 1,
                        cursor: loading || !token ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'UPDATING_CREDENTIALS...' : 'EXECUTE_CREDENTIAL_RESET →'}
                </button>
            </form>

            <div style={footerStyle}>
                <Link href="/login" style={linkStyle}>← RETURN_TO_ACCESS</Link>
                <Link href="/forgot-password" style={linkStyle}>NEW_RESET_LINK</Link>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div style={pageStyle}>
            <div style={gridBg} />
            <Suspense fallback={
                <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Courier New', monospace", fontSize: '0.8rem', letterSpacing: '2px' }}>
                    LOADING...
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}

// Styles
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
    fontSize: '1.1rem',
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
    fontSize: '0.75rem',
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
};
