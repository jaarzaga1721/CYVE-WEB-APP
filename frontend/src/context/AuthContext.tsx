'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '../config';

import { useApi } from '../hooks/useApi';

interface User {
    id: string | number;
    username: string;
    email: string;
    name: string;
    display_name?: string | null;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; message: string }>;
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    loading: boolean;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const { callApi, loading: apiLoading } = useApi();
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            // Check local storage first for immediate UI
            const savedUser = localStorage.getItem('cyve_user');
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {
                    localStorage.removeItem('cyve_user');
                }
            }

            const result = await callApi('check_session.php');
            if (result.success && result.data?.user) {
                setUser(result.data.user);
                localStorage.setItem('cyve_user', JSON.stringify(result.data.user));
            } else {
                setUser(null);
                localStorage.removeItem('cyve_user');
            }
            setInitializing(false);
        };
        checkSession();
    }, [callApi]);

    const login = async (email: string, password: string, remember: boolean = false): Promise<{ success: boolean; message: string }> => {
        const result = await callApi('login.php', {
            method: 'POST',
            body: JSON.stringify({ email, password, remember })
        });

        if (result.success && result.data?.user) {
            setUser(result.data.user);
            localStorage.setItem('cyve_user', JSON.stringify(result.data.user));
            if (result.data.token) {
                localStorage.setItem('cyve_token', result.data.token);
            }
        }
        return { success: result.success, message: result.message };
    };

    const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
        const result = await callApi('signup.php', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });

        if (result.success && result.data?.user) {
            setUser(result.data.user);
            localStorage.setItem('cyve_user', JSON.stringify(result.data.user));
            if (result.data.token) {
                localStorage.setItem('cyve_token', result.data.token);
            }
        }
        return { success: result.success, message: result.message };
    };

    const logout = async () => {
        await callApi('logout.php');
        setUser(null);
        localStorage.removeItem('cyve_user');
        localStorage.removeItem('cyve_token');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated: !!user, 
            login, 
            signup, 
            logout, 
            loading: initializing || apiLoading,
            setUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
