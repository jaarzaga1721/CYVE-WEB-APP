'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './Signup.module.css';

/**
 * Signup component refactored from signup.php
 */
const Signup: React.FC = () => {
    const router = useRouter();
    const { signup } = useAuth();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 8) {
            setError('Encryption key must be at least 8 segments long.');
            return;
        }

        setLoading(true);

        try {
            const result = await signup(fullName, email, password);
            if (result.success) {
                setSuccess('Identity Secured. Welcome to the CYVE Grid.');
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Neural uplink failed. Please re-authenticate and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h1 className="terminal-header-animate">CYVE</h1>
                    <p>Initialize Your Cyber-Security Career</p>
                </div>

                {error && (
                    <div className={`${styles.message} ${styles.error}`}>
                        <span>⚠️</span> {error}
                    </div>
                )}

                {success && (
                    <div className={`${styles.message} ${styles.success}`}>
                        <span>✔️</span> {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="full_name">Agent Designation (Full Name)</label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            placeholder="Identify yourself..."
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Neural-Link Address (Email)</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="agent_address@cyve.net"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Encryption Key (Password)</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Minimum 8 segments"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>

                    <button type="submit" className={styles.btnSignup} disabled={loading}>
                        {loading ? 'Securing Connection...' : 'Establish Identity'}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    Already have an identity? <Link href="/login">Authenticate at HQ</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
