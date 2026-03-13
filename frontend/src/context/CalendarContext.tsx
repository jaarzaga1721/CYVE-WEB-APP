'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useApi } from '../hooks/useApi';

export interface CalendarTask {
    id: string;
    date: string; // YYYY-MM-DD format
    title: string;
    description: string;
    completed: boolean;
    notes: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface CalendarContextType {
    tasks: CalendarTask[];
    addTask: (task: Omit<CalendarTask, 'id'>) => void;
    updateTask: (id: string, updates: Partial<CalendarTask>) => void;
    deleteTask: (id: string) => void;
    getTasksForDate: (date: string) => CalendarTask[];
    toggleTaskCompletion: (id: string) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    const { callApi } = useApi();
    const [tasks, setTasks] = useState<CalendarTask[]>([]);

    // Initial Load & Migration
    useEffect(() => {
        const loadCalendar = async () => {
            const storedTasks = localStorage.getItem('cyve_calendar_tasks');

            if (isAuthenticated) {
                // Try to load from server
                const result = await callApi('events.php');
                if (result.success && result.data?.events) {
                    // Map backend fields to frontend interface
                    const serverTasks = result.data.events.map((e: any) => ({
                        id: e.id.toString(),
                        date: e.event_date.split(' ')[0], // Remove time if present
                        title: e.title,
                        description: e.description,
                        completed: e.status === 'approved', // Mapping status to completed for now
                        notes: '',
                        priority: 'MEDIUM'
                    }));
                    setTasks(serverTasks);

                    // Migration logic
                    if (storedTasks && serverTasks.length === 0) {
                        const localTasks = JSON.parse(storedTasks);
                        for (const task of localTasks) {
                            await callApi('events.php', {
                                method: 'POST',
                                body: JSON.stringify({
                                    title: task.title,
                                    description: task.description,
                                    event_date: task.date,
                                    location: 'HQ'
                                })
                            });
                        }
                        // Re-fetch after migration
                        const refreshed = await callApi('events.php');
                        if (refreshed.success) {
                            setTasks(refreshed.data.events.map((e: any) => ({
                                id: e.id.toString(),
                                date: e.event_date.split(' ')[0],
                                title: e.title,
                                description: e.description,
                                completed: e.status === 'approved',
                                notes: '',
                                priority: 'MEDIUM'
                            })));
                        }
                    }
                }
            } else {
                // Guests
                if (storedTasks) {
                    setTasks(JSON.parse(storedTasks));
                } else {
                    // Sample tasks for new guests
                    const today = new Date();
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const sampleTasks: CalendarTask[] = [
                        { id: '1', date: today.toISOString().split('T')[0], title: 'System Diagnostics', description: 'Run initial security sweep', completed: false, notes: '', priority: 'HIGH' },
                        { id: '2', date: tomorrow.toISOString().split('T')[0], title: 'Firewall Audit', description: 'Patch detected vulnerabilities', completed: false, notes: '', priority: 'MEDIUM' },
                    ];
                    setTasks(sampleTasks);
                    localStorage.setItem('cyve_calendar_tasks', JSON.stringify(sampleTasks));
                }
            }
        };

        loadCalendar();
    }, [isAuthenticated, callApi]);

    const addTask = async (task: Omit<CalendarTask, 'id'>) => {
        if (isAuthenticated) {
            const result = await callApi('events.php', {
                method: 'POST',
                body: JSON.stringify({
                    title: task.title,
                    description: task.description,
                    event_date: task.date
                })
            });
            if (result.success) {
                const newTask = { ...task, id: result.data.id.toString() };
                setTasks((prev: CalendarTask[]) => [...prev, newTask]);
            }
        } else {
            const newTask = { ...task, id: Date.now().toString() };
            const updated = [...tasks, newTask];
            setTasks(updated);
            localStorage.setItem('cyve_calendar_tasks', JSON.stringify(updated));
        }
    };

    const deleteTask = async (id: string) => {
        if (isAuthenticated) {
            await callApi('events.php', {
                method: 'DELETE',
                body: JSON.stringify({ id })
            });
            setTasks((prev: CalendarTask[]) => prev.filter((t: CalendarTask) => t.id !== id));
        } else {
            const updated = tasks.filter(task => task.id !== id);
            setTasks(updated);
            localStorage.setItem('cyve_calendar_tasks', JSON.stringify(updated));
        }
    };

    const updateTask = (id: string, updates: Partial<CalendarTask>) => {
        // Simple client-side update for now, could add PUT to backend later
        const updatedTasks = tasks.map((task: CalendarTask) =>
            task.id === id ? { ...task, ...updates } : task
        );
        setTasks(updatedTasks);
        if (!isAuthenticated) {
            localStorage.setItem('cyve_calendar_tasks', JSON.stringify(updatedTasks));
        }
    };

    const getTasksForDate = (date: string) => {
        return tasks.filter(task => task.date === date);
    };

    const toggleTaskCompletion = (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            updateTask(id, { completed: !task.completed });
        }
    };

    return (
        <CalendarContext.Provider
            value={{ tasks, addTask, updateTask, deleteTask, getTasksForDate, toggleTaskCompletion }}
        >
            {children}
        </CalendarContext.Provider>
    );
}

export function useCalendar() {
    const context = useContext(CalendarContext);
    if (context === undefined) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
}
