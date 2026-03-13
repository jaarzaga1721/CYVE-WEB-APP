'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './Login.module.css';

/**
 * Login component with enhanced UX and validation
 */
const Login: React.FC = () => {
    const router = useRouter();
    const { login } = useAuth();

    const [identity, setIdentity] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ identity?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState<{ identity?: boolean; password?: boolean }>({});

    // Real-time validation
    const validateIdentity = (value: string): string | undefined => {
        if (!value.trim()) return 'Identity required for decryption';
        if (value.includes('@')) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Invalid neural-link address';
        }
        return undefined;
    };

    const validatePassword = (value: string): string | undefined => {
        if (!value) return 'Access key required';
        if (value.length < 8) return 'Key must be at least 8 segments';
        return undefined;
    };

    const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setIdentity(value);
        if (touched.identity) {
            const error = validateIdentity(value);
            setFieldErrors(prev => ({ ...prev, identity: error }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        if (touched.password) {
            const error = validatePassword(value);
            setFieldErrors(prev => ({ ...prev, password: error }));
        }
    };

    const handleIdentityBlur = () => {
        setTouched(prev => ({ ...prev, identity: true }));
        const error = validateIdentity(identity);
        setFieldErrors(prev => ({ ...prev, identity: error }));
    };

    const handlePasswordBlur = () => {
        setTouched(prev => ({ ...prev, password: true }));
        const error = validatePassword(password);
        setFieldErrors(prev => ({ ...prev, password: error }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setTouched({ identity: true, password: true });

        const identityError = validateIdentity(identity);
        const passwordError = validatePassword(password);
        
        setFieldErrors({
            identity: identityError,
            password: passwordError
        });

        if (identityError || passwordError) return;

        setLoading(true);

        try {
            const result = await login(identity, password, remember);
            if (result.success) {
                router.push('/');
            } else {
                setError(result.message || 'Access Denied. Identity/Key mismatch.');
            }
        } catch (err) {
            setError('Signal Lost. Check your connection to the grid.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h1 className="terminal-header-animate">CYVE</h1>
                    <p>Access Granted Only to Authorized Personnel</p>
                </div>

                {error && (
                    <div className={styles.errorMessage} role="alert">
                        <span>⚠️</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.formGroup}>
                        <label htmlFor="identity">Email or Username</label>
                        <input
                            type="text"
                            id="identity"
                            name="identity"
                            placeholder="agent_identity@cyve.net"
                            value={identity}
                            onChange={handleIdentityChange}
                            onBlur={handleIdentityBlur}
                            className={fieldErrors.identity ? styles.inputError : ''}
                            autoFocus
                            autoComplete="username"
                        />
                        {fieldErrors.identity && (
                            <span className={styles.fieldError}>{fieldErrors.identity}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Access Key</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={handlePasswordBlur}
                                className={fieldErrors.password ? styles.inputError : ''}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {fieldErrors.password && (
                            <span className={styles.fieldError}>{fieldErrors.password}</span>
                        )}
                    </div>

                    <div className={styles.formOptions}>
                        <div className={styles.rememberMe}>
                            <input
                                id="remember"
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            <label htmlFor="remember">Remember Agent</label>
                        </div>
                        <Link href="/forgot-password" className={styles.forgotLink}>
                            Lost Key?
                        </Link>
                    </div>
                    <span className={styles.helpText}>Maintain active session for 30 cycles</span>

                    <button 
                        type="submit" 
                        className={styles.btnLogin} 
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className={styles.spinner}></span>
                                Decrypting...
                            </>
                        ) : (
                            'Establish Connection'
                        )}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    New Agent? <Link href="/signup">Register at HQ</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
