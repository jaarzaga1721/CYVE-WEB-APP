'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '../config';

export interface Education {
    id: string;
    school: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    description: string;
    startDate: string;
    endDate: string;
}

export type PreferredRole = 'red' | 'blue' | 'purple';

export interface ProfileData {
    name: string;
    email: string;
    location: string;
    bio: string;
    phone: string;
    /** User's chosen cybersecurity role path: Red (Offensive), Blue (Defensive), Purple (Hybrid) */
    preferredRole: PreferredRole | null;
    education: Education[];
    experience: Experience[];
    skills: string[];
    certifications: string[];
}

interface ProfileContextType {
    profile: ProfileData;
    updateProfile: (updates: Partial<ProfileData>) => void;
    addEducation: (edu: Omit<Education, 'id'>) => void;
    removeEducation: (id: string) => void;
    addExperience: (exp: Omit<Experience, 'id'>) => void;
    removeExperience: (id: string) => void;
    addSkill: (skill: string) => void;
    removeSkill: (skill: string) => void;
    addCertification: (cert: string) => void;
    removeCertification: (cert: string) => void;
}

const defaultProfile: ProfileData = {
    name: '',
    email: '',
    location: '',
    bio: '',
    phone: '',
    preferredRole: null,
    education: [],
    experience: [],
    skills: [],
    certifications: [],
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

import { useAuth } from './AuthContext';


export function ProfileProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, user: authUser } = useAuth();
    const [profile, setProfile] = useState<ProfileData>(defaultProfile);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!isAuthenticated) {
                setProfile(defaultProfile);
                setIsInitialLoad(false);
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile.php`, {
                    credentials: 'include'
                });
                const data = await res.json();
                if (data.success && data.profile) {
                    setProfile(data.profile);
                } else if (data.success && !data.profile && authUser) {
                    // Initialize empty profile with auth user data
                    const initialProfile = { 
                        ...defaultProfile, 
                        name: authUser.name || '', 
                        email: authUser.email || '' 
                    };
                    setProfile(initialProfile);
                }
            } catch (error) {
                console.error('Failed to pull mission dossier:', error);
            } finally {
                setIsInitialLoad(false);
            }
        };

        fetchProfile();
    }, [isAuthenticated, authUser]);

    const saveProfileToBackend = async (newProfile: ProfileData) => {
        setProfile(newProfile);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProfile),
                credentials: 'include'
            });
        } catch (error) {
            console.error('Failed to sync dossier to HQ:', error);
        }
    };

    const updateProfile = (updates: Partial<ProfileData>) => {
        saveProfileToBackend({ ...profile, ...updates });
    };

    const addEducation = (edu: Omit<Education, 'id'>) => {
        const newEdu: Education = { ...edu, id: Date.now().toString() };
        saveProfileToBackend({ ...profile, education: [...profile.education, newEdu] });
    };

    const removeEducation = (id: string) => {
        saveProfileToBackend({ ...profile, education: profile.education.filter(e => e.id !== id) });
    };

    const addExperience = (exp: Omit<Experience, 'id'>) => {
        const newExp: Experience = { ...exp, id: Date.now().toString() };
        saveProfileToBackend({ ...profile, experience: [...profile.experience, newExp] });
    };

    const removeExperience = (id: string) => {
        saveProfileToBackend({ ...profile, experience: profile.experience.filter(e => e.id !== id) });
    };

    const addSkill = (skill: string) => {
        if (!profile.skills.includes(skill)) {
            saveProfileToBackend({ ...profile, skills: [...profile.skills, skill] });
        }
    };

    const removeSkill = (skill: string) => {
        saveProfileToBackend({ ...profile, skills: profile.skills.filter(s => s !== skill) });
    };

    const addCertification = (cert: string) => {
        if (!profile.certifications.includes(cert)) {
            saveProfileToBackend({ ...profile, certifications: [...profile.certifications, cert] });
        }
    };

    const removeCertification = (cert: string) => {
        saveProfileToBackend({ ...profile, certifications: profile.certifications.filter(c => c !== cert) });
    };

    if (isInitialLoad) {
        return null; // Or a loading spinner
    }

    return (
        <ProfileContext.Provider
            value={{
                profile,
                updateProfile,
                addEducation,
                removeEducation,
                addExperience,
                removeExperience,
                addSkill,
                removeSkill,
                addCertification,
                removeCertification,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
}
