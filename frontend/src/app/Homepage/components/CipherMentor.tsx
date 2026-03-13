'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './CipherMentor.module.css';

interface Message {
    id: string;
    role: 'cipher' | 'user';
    text: string;
    timestamp: Date;
}

const CIPHER_KNOWLEDGE_BASE = [
    // Greetings
    { patterns: ['hello', 'hi', 'hey', 'start', 'begin'], response: "CIPHER_AI // ONLINE\n\nGreetings, Operative. I am CIPHER — your tactical cybersecurity mentor.\n\nAsk me anything about penetration testing, defensive security, certifications, or your career path. I'm here to guide you through the grid." },
    // Roadmap
    { patterns: ['roadmap', 'path', 'where to start', 'beginner', 'start learning'], response: "RECOMMENDED_ENTRY_PROTOCOL:\n\n[01] CompTIA Security+ — Foundation of all things security.\n[02] TryHackMe / HackTheBox — Hands-on practice environment.\n[03] Choose your specialization:\n  → Red Team: eJPT → OSCP\n  → Blue Team: CySA+ → GCIH\n  → Purple Team: GCTI → CCSP\n\nYour CYVE Roadmap is personalized to your selected team. Access it at /roadmap." },
    // OSCP
    { patterns: ['oscp', 'offensive security', 'penetration test cert'], response: "OSCP (Offensive Security Certified Professional):\n\nDifficulty: ████████░░ ADVANCED\nPrereq: Networking, Linux, Python basics\nFormat: 24-hour hands-on exam + report\n\nRecommended path:\neJPT → PEH (TCM Academy) → HTB Pro Labs → OSCP\n\nThis is the gold standard for penetration testers. Expect 3-6 months of dedicated prep." },
    // SQL Injection
    { patterns: ['sql injection', 'sqli', 'database attack', 'sql'], response: "SQL INJECTION — THREAT_VECTOR_ANALYSIS:\n\nSQL injection exploits improper input handling in database queries.\n\nExample payload: ' OR '1'='1\n\nPrevention:\n• Use prepared statements / parameterized queries\n• Input validation and sanitization\n• Least-privilege DB accounts\n• WAF deployment\n\nPractice: SQLi labs on HackTheBox or PortSwigger Web Academy (free)." },
    // Networking
    { patterns: ['networking', 'tcp', 'ip', 'osi', 'network fundamentals'], response: "NETWORKING_PRIMER:\n\nOSI Model (critical for all cyber roles):\nL7 Application → L6 Presentation → L5 Session\nL4 Transport (TCP/UDP) → L3 Network (IP)\nL2 Data Link → L1 Physical\n\nKey protocols: TCP/IP, DNS, HTTP/S, SSH, SMTP, FTP\n\nTool: Use Wireshark to capture and analyze live traffic. Start with your home network." },
    // Kali Linux
    { patterns: ['kali', 'linux', 'tools', 'terminal', 'bash'], response: "KALI_LINUX // OPERATIVE_OS:\n\nEssential tools pre-installed:\n• Nmap — Port scanning & service detection\n• Metasploit — Exploitation framework\n• Burp Suite — Web app proxy\n• Aircrack-ng — WiFi security\n• John/Hashcat — Password cracking\n\nCommand to remember: nmap -sV -sC -oN scan.txt <target>\n\nRun Kali in VirtualBox or dual-boot for best results." },
    // SOC
    { patterns: ['soc', 'blue team', 'defensive', 'analyst', 'monitoring'], response: "SOC_ANALYST // DEFENSIVE_OPS:\n\nA SOC (Security Operations Center) is the nerve center of defensive security.\n\nCore skills:\n• SIEM tools: Splunk, IBM QRadar, Elastic\n• Incident triage and escalation\n• Log correlation and threat hunting\n• Understanding of MITRE ATT&CK framework\n\nEntry cert: CompTIA CySA+\nTarget job title: Tier 1 SOC Analyst → Tier 2 → IR Lead" },
    // CTF
    { patterns: ['ctf', 'capture the flag', 'practice', 'challenge'], response: "CTF_TRAINING_GROUNDS:\n\nBest platforms for skill-building:\n• TryHackMe — Guided, beginner-friendly ⭐\n• HackTheBox — More realistic, advanced\n• PicoCTF — Great for students\n• CTFtime.org — Live competition calendar\n\nStart with TryHackMe's 'Pre-Security' and 'Jr Penetration Tester' paths. Estimated time: 60-80 hours to build a solid foundation." },
    // Certs
    { patterns: ['certification', 'cert', 'comptia', 'credential'], response: "CERTIFICATION_MATRIX:\n\nEntry Level:\n✓ CompTIA Security+ — Universal baseline\n✓ eJPT (eLearnSecurity) — Red team entry\n✓ BTL1 — Blue team entry\n\nIntermediate:\n✓ CEH — Ethical hacking methodology\n✓ CySA+ — SOC / blue team analytics\n✓ PNPT — Practical pentest cert\n\nAdvanced:\n✓ OSCP — Industry gold standard (offensive)\n✓ GCIH — Incident handling\n✓ CISM / CISSP — Management & architecture\n\nChoose based on your team: Red → OSCP, Blue → CySA+, Purple → GCTI" },
    // Salary / Jobs
    { patterns: ['salary', 'job', 'career', 'work', 'hiring', 'money'], response: "PH_CYBER_JOB_MARKET // INTEL:\n\nCurrent market (2025):\n• Junior SOC Analyst: ₱40,000 – 60,000/mo\n• Mid-level Pen Tester: ₱80,000 – 120,000/mo\n• Senior Cloud Security Eng: ₱130,000 – 200,000/mo\n\nTop employers: BDO, Globe, Accenture, Security Bank, PLDT\nHot cities: BGC, Makati, Ortigas, Cebu IT Park\n\nVisit /jobs for current active listings in the CYVE Job Board." },
    // Default fallback
    { patterns: [], response: "CIPHER_ERROR // Query not recognized in current knowledge base.\n\nTry asking about:\n• Certifications (OSCP, CySA+, eJPT)\n• Topics (SQL Injection, Networking, Kali Linux)\n• Career paths (SOC Analyst, Pen Tester)\n• Practice platforms (CTF, TryHackMe)\n• PH Job market\n\nI'm learning. More intel modules coming in future updates." },
];

function getCipherResponse(input: string): string {
    const lower = input.toLowerCase();
    for (const entry of CIPHER_KNOWLEDGE_BASE) {
        if (entry.patterns.length > 0 && entry.patterns.some(p => lower.includes(p))) {
            return entry.response;
        }
    }
    return CIPHER_KNOWLEDGE_BASE[CIPHER_KNOWLEDGE_BASE.length - 1].response;
}

const QUICK_PROMPTS = [
    'Where should I start?',
    'Tell me about OSCP',
    'How do I become a SOC Analyst?',
    'Best CTF platforms?',
    'PH salary benchmarks',
];

export default function CipherMentor({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '0',
            role: 'cipher',
            text: "CIPHER_AI // STANDBY\n\nGreetings, Operative. I am CIPHER, your AI cybersecurity mentor.\n\nAsk me anything — certifications, career paths, tools, or PH job intel.",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
    }, [isOpen]);

    const sendMessage = (text?: string) => {
        const content = text || input.trim();
        if (!content) return;
        setInput('');

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: content, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        setTimeout(() => {
            const response = getCipherResponse(content);
            const cipherMsg: Message = { id: (Date.now() + 1).toString(), role: 'cipher', text: response, timestamp: new Date() };
            setMessages(prev => [...prev, cipherMsg]);
            setIsTyping(false);
        }, 800 + Math.random() * 600);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.panel} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.panelHeader}>
                    <div className={styles.headerLeft}>
                        <div className={styles.cipherAvatar}>
                            <span>CI</span>
                            <div className={styles.avatarPulse} />
                        </div>
                        <div>
                            <div className={styles.cipherName}>CIPHER_AI</div>
                            <div className={styles.cipherStatus}>● ONLINE // TACTICAL_MENTOR_v1.0</div>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                {/* Messages */}
                <div className={styles.messages}>
                    {messages.map(msg => (
                        <div key={msg.id} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.cipherMessage}`}>
                            {msg.role === 'cipher' && (
                                <div className={styles.msgAvatar}>CI</div>
                            )}
                            <div className={styles.msgBubble}>
                                <pre className={styles.msgText}>{msg.text}</pre>
                                <span className={styles.msgTime}>
                                    {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className={`${styles.message} ${styles.cipherMessage}`}>
                            <div className={styles.msgAvatar}>CI</div>
                            <div className={styles.msgBubble}>
                                <div className={styles.typingDots}>
                                    <span /><span /><span />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Quick prompts */}
                <div className={styles.quickPrompts}>
                    {QUICK_PROMPTS.map(q => (
                        <button key={q} className={styles.quickBtn} onClick={() => sendMessage(q)}>{q}</button>
                    ))}
                </div>

                {/* Input */}
                <form className={styles.inputRow} onSubmit={e => { e.preventDefault(); sendMessage(); }}>
                    <span className={styles.inputPrompt}>$</span>
                    <input
                        ref={inputRef}
                        className={styles.textInput}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask CIPHER anything..."
                    />
                    <button type="submit" className={styles.sendBtn} disabled={!input.trim()}>
                        ↵
                    </button>
                </form>
            </div>
        </div>
    );
}
