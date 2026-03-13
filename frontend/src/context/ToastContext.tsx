'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'auth';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    }, []);

    const getToastStyle = (type: ToastType) => {
        switch (type) {
            case 'success':
                return { borderLeft: '4px solid #4caf50' };
            case 'error':
                return { borderLeft: '4px solid #e53935' };
            case 'auth':
                return { borderLeft: '4px solid #f5a623' };
            default: // info
                return { borderLeft: '4px solid #4a9eff' };
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    pointerEvents: 'none',
                }}
            >
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        style={{
                            background: '#1a1a1a',
                            color: '#ffffff',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                            pointerEvents: 'auto',
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            animation: 'slideInRight 0.3s ease forwards',
                            ...getToastStyle(toast.type),
                        }}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
            <style jsx global>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
