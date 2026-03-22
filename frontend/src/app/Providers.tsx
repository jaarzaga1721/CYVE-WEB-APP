'use client';

import { AuthProvider } from '@/context/AuthContext';
import { RoadmapProvider } from '@/context/RoadmapContext';
import { CalendarProvider } from '@/context/CalendarContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { ToastProvider } from '@/context/ToastContext';
import { StreakProvider } from '@/context/StreakContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <AuthProvider>
                <ProfileProvider>
                    <RoadmapProvider>
                        <CalendarProvider>
                            <StreakProvider>
                                {children}
                            </StreakProvider>
                        </CalendarProvider>
                    </RoadmapProvider>
                </ProfileProvider>
            </AuthProvider>
        </ToastProvider>
    );
}
