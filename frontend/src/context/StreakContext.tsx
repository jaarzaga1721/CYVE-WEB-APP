'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string | null;
    totalDaysActive: number;
    season: number;
    seasonXP: number;
    rank: string;
}

interface StreakContextType {
    streak: StreakData;
    checkIn: () => void;
    addXP: (amount: number) => void;
}

const RANK_THRESHOLDS = [
    { rank: 'RECRUIT', min: 0 },
    { rank: 'OPERATIVE', min: 200 },
    { rank: 'SPECIALIST', min: 600 },
    { rank: 'AGENT', min: 1200 },
    { rank: 'ELITE', min: 2500 },
    { rank: 'PHANTOM', min: 5000 },
];

function getRank(xp: number): string {
    let rank = RANK_THRESHOLDS[0].rank;
    for (const t of RANK_THRESHOLDS) {
        if (xp >= t.min) rank = t.rank;
    }
    return rank;
}

const defaultStreak: StreakData = {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    totalDaysActive: 0,
    season: 1,
    seasonXP: 0,
    rank: 'RECRUIT',
};

const StreakContext = createContext<StreakContextType | undefined>(undefined);

export function StreakProvider({ children }: { children: ReactNode }) {
    const [streak, setStreak] = useState<StreakData>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('cyve_streak');
            return saved ? JSON.parse(saved) : defaultStreak;
        }
        return defaultStreak;
    });

    useEffect(() => {
        localStorage.setItem('cyve_streak', JSON.stringify(streak));
    }, [streak]);

    const checkIn = () => {
        const today = new Date().toISOString().split('T')[0];
        if (streak.lastActiveDate === today) return; // Already checked in today

        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const isConsecutive = streak.lastActiveDate === yesterday;

        setStreak(prev => {
            const newStreak = isConsecutive ? prev.currentStreak + 1 : 1;
            const newXP = prev.seasonXP + 50; // 50 XP for daily check-in
            return {
                ...prev,
                currentStreak: newStreak,
                longestStreak: Math.max(newStreak, prev.longestStreak),
                lastActiveDate: today,
                totalDaysActive: prev.totalDaysActive + 1,
                seasonXP: newXP,
                rank: getRank(newXP),
            };
        });
    };

    const addXP = (amount: number) => {
        setStreak(prev => {
            const newXP = prev.seasonXP + amount;
            return { ...prev, seasonXP: newXP, rank: getRank(newXP) };
        });
    };

    return (
        <StreakContext.Provider value={{ streak, checkIn, addXP }}>
            {children}
        </StreakContext.Provider>
    );
}

export function useStreak() {
    const ctx = useContext(StreakContext);
    if (!ctx) throw new Error('useStreak must be within StreakProvider');
    return ctx;
}

export { RANK_THRESHOLDS, getRank };
