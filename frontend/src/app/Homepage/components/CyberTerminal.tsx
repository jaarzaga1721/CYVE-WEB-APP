'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '../page.module.css';

interface TerminalLine {
    type: 'prompt' | 'output' | 'error' | 'system';
    content: string;
    cmd?: string;
}

interface CyberTerminalProps {
    user?: any;
    progress?: number;
    tasks?: any[];
    onSearch?: (query: string) => void;
}

export function CyberTerminal({ user, progress, tasks = [], onSearch }: CyberTerminalProps) {
    const [lines, setLines] = useState<TerminalLine[]>([
        { type: 'system', content: '[SYSTEM] CYVE_OS V1.0.4 loaded.' },
        { type: 'system', content: '[SYSTEM] Neural-link established. Ready for input.' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [lines]);

    const handleCommand = (cmd: string) => {
        const cleanCmd = cmd.trim().toLowerCase();
        const newLines: TerminalLine[] = [...lines, { type: 'prompt', content: cmd }];

        if (cleanCmd === 'help') {
            newLines.push({ type: 'output', content: 'AVAILABLE COMMANDS:\n- whoami: Display session identity\n- ls missions: List active calendar tasks\n- status: Show roadmap progression\n- clear: Purge terminal logs\n- search <query>: Query career database (Try: "security", "hacker", "analyst")' });
        } else if (cleanCmd === 'whoami') {
            const identity = user ? `[AUTHORIZED] ${user.display_name || user.username} // ROLE: ${user.role}` : '[GUEST] Anonymous Access Interface';
            newLines.push({ type: 'output', content: identity });
        } else if (cleanCmd === 'ls missions' || cleanCmd === 'ls') {
            if (tasks.length === 0) {
                newLines.push({ type: 'output', content: 'No active missions found in current sector.' });
            } else {
                const missionList = tasks.map(t => `- [${t.date}] ${t.title}`).join('\n');
                newLines.push({ type: 'output', content: `ACTIVE MISSIONS:\n${missionList}` });
            }
        } else if (cleanCmd === 'status') {
            newLines.push({ type: 'output', content: `PRIMARY OBJECTIVE PROGRESS: ${progress || 0}%` });
            const bar = '█'.repeat(Math.floor((progress || 0) / 10)) + '░'.repeat(10 - Math.floor((progress || 0) / 10));
            newLines.push({ type: 'output', content: `[${bar}]` });
        } else if (cleanCmd === 'clear') {
            setLines([]);
            return;
        } else if (cleanCmd.startsWith('search ')) {
            const query = cleanCmd.replace('search ', '');
            if (onSearch) {
                onSearch(query);
                newLines.push({ type: 'output', content: `Querying neural database for: "${query}"...` });
            }
        } else if (cleanCmd === '') {
            // Do nothing
        } else {
            newLines.push({ type: 'error', content: `sh: command not found: ${cleanCmd}` });
        }

        setLines(newLines);
        setInputValue('');
    };

    return (
        <div className={styles.terminalContainer}>
            <div className={styles.terminalHeader}>
                <div className={styles.terminalDots}>
                    <span></span><span></span><span></span>
                </div>
                <div className={styles.terminalTitle}>CYVE_OS // TERMINAL</div>
            </div>
            
            <div className={styles.terminalBody} ref={bodyRef}>
                {lines.map((line, i) => (
                    <div key={i} className={`${styles.terminalLine} ${styles[line.type]}`}>
                        {line.type === 'prompt' && <span className={styles.prompt}>agent@cyve:~$ </span>}
                        <pre className={styles.lineContent}>{line.content}</pre>
                    </div>
                ))}
                
                <div className={styles.terminalInputRow}>
                    <span className={styles.prompt}>agent@cyve:~$ </span>
                    <input 
                        type="text" 
                        className={styles.terminalInput} 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCommand(inputValue);
                        }}
                        autoFocus
                        spellCheck={false}
                    />
                </div>
            </div>
        </div>
    );
}
