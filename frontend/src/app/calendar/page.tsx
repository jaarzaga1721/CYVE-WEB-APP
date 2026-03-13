'use client';

import ProtectedRoute from '@/app/Homepage/components/ProtectedRoute';
import { useCalendar } from '@/context/CalendarContext';
import { useState } from 'react';
import Link from 'next/link';
import styles from './calendar.module.css';

export default function CalendarPage() {
    return (
        <ProtectedRoute>
            <CalendarContent />
        </ProtectedRoute>
    );
}

function CalendarContent() {
    const { tasks, addTask, toggleTaskCompletion, deleteTask } = useCalendar();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskForm, setTaskForm] = useState<{ title: string; description: string; notes: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' }>({ title: '', description: '', notes: '', priority: 'MEDIUM' });

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

    const formatDate = (day: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        return new Date(year, month, day).toISOString().split('T')[0];
    };

    const getTasksForDay = (day: number) => {
        const dateStr = formatDate(day);
        return tasks.filter(task => task.date === dateStr);
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDayClick = (day: number) => {
        setSelectedDate(formatDate(day));
        setShowTaskModal(true);
    };

    const handleAddTask = () => {
        if (selectedDate && taskForm.title) {
            addTask({
                date: selectedDate,
                title: taskForm.title,
                description: taskForm.description,
                completed: false,
                notes: taskForm.notes,
                priority: taskForm.priority,
            });
            setTaskForm({ title: '', description: '', notes: '', priority: 'MEDIUM' });
        }
    };

    const handleDeleteTask = (id: string) => {
        if (window.confirm('[WARNING] This action is irreversible. Confirm termination?')) {
            // we will need to import deleteTask from context, let's assume it's added. Wait, we destructured toggleTaskCompletion, need to get deleteTask too.
        }
    };

    const selectedDayTasks = selectedDate ? tasks.filter(t => t.date === selectedDate) : [];

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.terminalHeader}>
                        <span className={styles.prompt}>admin@cyve:~$</span>
                        <span className={styles.typing}> access_calendar --active</span>
                    </div>
                    <h1>MISSION_OPERATIONS_CENTER</h1>
                    <p>TRACK_IDENTIFIED_OBJECTIVES // MANAGE_OPERATIVE_TASKS</p>
                </header>

                {/* --- 70/30 SPLIT LAYOUT START --- */}
                <div className={styles.dashboardLayout}>
                    
                    {/* LEFT 70% GRID */}
                    <div className={styles.calendarContainer}>
                        <div className={styles.calendarHeader}>
                            <div className={styles.monthNav}>
                                <button onClick={handlePrevMonth} className={styles.navBtn}>←</button>
                                <button onClick={() => setCurrentDate(new Date())} className={styles.todayBtn}>TODAY</button>
                                <button onClick={handleNextMonth} className={styles.navBtn}>→</button>
                            </div>
                            <h2>
                                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h2>
                            <button 
                                onClick={() => { setSelectedDate(new Date().toISOString().split('T')[0]); }} 
                                className={styles.addTaskBtn}
                            >
                                + NEW_OBJECTIVE
                            </button>
                        </div>

                        <div className={styles.calendar}>
                            <div className={styles.weekdays}>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className={styles.weekday}>{day}</div>
                                ))}
                            </div>

                            <div className={styles.days}>
                                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                                    <div key={`empty-${i}`} className={styles.dayEmpty}></div>
                                ))}

                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const dayTasks = getTasksForDay(day);
                                    const isToday = formatDate(day) === new Date().toISOString().split('T')[0];

                                    return (
                                        <div
                                            key={day}
                                            className={`${styles.day} ${isToday ? styles.today : ''}`}
                                            onClick={() => handleDayClick(day)}
                                        >
                                            <span className={styles.dayNumber}>{day}</span>
                                            {dayTasks.length > 0 && (
                                                <div className={styles.taskIndicators}>
                                                    {dayTasks.slice(0, 2).map(task => {
                                                        const pColor = task.priority === 'HIGH' ? styles.chipHigh : task.priority === 'LOW' ? styles.chipLow : styles.chipMedium;
                                                        return (
                                                            <div
                                                                key={task.id}
                                                                className={`${styles.taskChip} ${task.completed ? styles.completed : ''} ${pColor}`}
                                                                title={task.title}
                                                            >
                                                                {task.title}
                                                            </div>
                                                        );
                                                    })}
                                                    {dayTasks.length > 2 && (
                                                        <span className={styles.moreIndicator}>+{dayTasks.length - 2} more</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {tasks.filter(task => {
                                    const taskDate = new Date(task.date);
                                    return taskDate.getMonth() === currentDate.getMonth() && taskDate.getFullYear() === currentDate.getFullYear();
                                }).length === 0 && (
                                    <div className={styles.emptyMonthMsg}>
                                        No missions scheduled. Add tasks from your Roadmap.
                                        <Link href="/roadmap">Go to Roadmap →</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.legend}>
                            <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.highDot}`}></span> HIGH PRIORITY</div>
                            <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.mediumDot}`}></span> MEDIUM PRIORITY</div>
                            <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.lowDot}`}></span> LOW PRIORITY</div>
                        </div>
                    </div>
                    {/* END LEFT 70% GRID */}

                    {/* RIGHT 30% PANEL */}
                    <div className={styles.sidePanel}>
                        {selectedDate ? (
                            <>
                                <h2 className={styles.sidePanelTitle}>
                                    INTEL_DOSSIER: {new Date(selectedDate as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </h2>

                                <div className={styles.tasksList}>
                                    {selectedDayTasks.length > 0 ? selectedDayTasks.map(task => (
                                        <div key={task.id} className={`${styles.taskItem} ${task.completed ? styles.taskItemCompleted : ''}`}>
                                            <div className={styles.taskHeaderRow}>
                                                <input 
                                                    type="checkbox" 
                                                    className={styles.cyveCheckbox}
                                                    checked={task.completed}
                                                    onChange={() => toggleTaskCompletion(task.id)}
                                                />
                                                <h4 style={task.completed ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>{task.title}</h4>
                                                <button onClick={() => {
                                                    if (window.confirm('[WARNING] This action is irreversible. Confirm termination?')) {
                                                        deleteTask(task.id);
                                                    }
                                                }} className={styles.deleteBtn}>✕</button>
                                            </div>
                                            <div className={styles.taskInfo}>
                                                {task.priority && (
                                                    <span className={`${styles.priorityBadge} ${task.priority === 'HIGH' ? styles.badgeHigh : task.priority === 'LOW' ? styles.badgeLow : styles.badgeMedium}`}>
                                                        {task.priority}_PRIORITY
                                                    </span>
                                                )}
                                                <p>{task.description}</p>
                                                {task.notes && <p className={styles.notes}><span>📝</span> {task.notes}</p>}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className={styles.noTasks}>No active missions for this date.</div>
                                    )}
                                </div>

                                <div className={styles.addTaskForm}>
                                    <h3 className={styles.formHeading}>INITIALIZE_NEW_OBJECTIVE</h3>
                                    
                                    <label className={styles.formLabel}>MISSION TITLE</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="e.g., Audit SQL Logs"
                                        value={taskForm.title}
                                        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                                    />
                                    
                                    <label className={styles.formLabel}>PRIORITY LEVEL</label>
                                    <div className={styles.priorityToggleGroup}>
                                        <button 
                                            className={`${styles.pvtBtn} ${taskForm.priority === 'LOW' ? styles.pvtLow : ''}`}
                                            onClick={() => setTaskForm({...taskForm, priority: 'LOW'})}
                                        >LOW</button>
                                        <button 
                                            className={`${styles.pvtBtn} ${taskForm.priority === 'MEDIUM' ? styles.pvtMedium : ''}`}
                                            onClick={() => setTaskForm({...taskForm, priority: 'MEDIUM'})}
                                        >MED</button>
                                        <button 
                                            className={`${styles.pvtBtn} ${taskForm.priority === 'HIGH' ? styles.pvtHigh : ''}`}
                                            onClick={() => setTaskForm({...taskForm, priority: 'HIGH'})}
                                        >HIGH</button>
                                    </div>

                                    <label className={styles.formLabel}>DESCRIPTION (OPTIONAL)</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="Brief objective summary"
                                        value={taskForm.description}
                                        onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                                    />

                                    <label className={styles.formLabel}>OPERATIVE NOTES (OPTIONAL)</label>
                                    <textarea
                                        className={styles.formTextarea}
                                        placeholder="Terminal commands, IP addresses, etc."
                                        value={taskForm.notes}
                                        onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })}
                                    />
                                    
                                    <button onClick={handleAddTask} className={styles.btnPrimaryFull}>
                                        ESTABLISH_MISSION
                                    </button>
                                    
                                    <button
                                        onClick={() => setSelectedDate(null)}
                                        className={styles.btnGhost}
                                    >
                                        Close Uplink
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className={styles.placeholderPanel}>
                                <div className={styles.placeholderIcon}>📅</div>
                                <h3>AWAITING_INPUT</h3>
                                <p>Select a date from the calendar grid to view intel or initialize a new mission.</p>
                            </div>
                        )}
                    </div>
                    {/* END RIGHT 30% PANEL */}

                </div>
                {/* --- 70/30 SPLIT LAYOUT END --- */}
            </div>
        </div>
    );
}
