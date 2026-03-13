import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            padding: '2rem',
            fontFamily: 'inherit',
        }}>
            {/* Grid overlay */}
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundImage: 'linear-gradient(rgba(245,166,35,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.03) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
                pointerEvents: 'none',
            }} />

            {/* Error code */}
            <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '0.7rem',
                letterSpacing: '3px',
                color: 'rgba(245,166,35,0.5)',
                marginBottom: '1.5rem',
            }}>
                CYVE_OS // ERROR_CODE_404
            </div>

            <div style={{
                fontSize: 'clamp(6rem, 20vw, 12rem)',
                fontWeight: 900,
                lineHeight: 1,
                background: 'linear-gradient(135deg, #f5a623 0%, rgba(245,166,35,0.15) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-4px',
                marginBottom: '1rem',
                filter: 'drop-shadow(0 0 30px rgba(245,166,35,0.2))',
            }}>
                404
            </div>

            <h1 style={{
                fontSize: '1rem',
                fontWeight: 900,
                letterSpacing: '4px',
                color: '#fff',
                margin: '0 0 0.75rem',
                textTransform: 'uppercase',
            }}>
                SECTOR_NOT_FOUND
            </h1>

            <p style={{
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '1.5px',
                fontFamily: "'Courier New', monospace",
                marginBottom: '3rem',
                maxWidth: '360px',
                lineHeight: 1.6,
            }}>
                The coordinates you entered do not exist in our network.<br />
                You may have been misdirected or this sector has been decommissioned.
            </p>

            {/* Quick nav */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/" style={{
                    background: '#f5a623',
                    color: '#000',
                    fontWeight: 900,
                    fontSize: '0.7rem',
                    letterSpacing: '2px',
                    padding: '0.75rem 1.75rem',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                }}>
                    RETURN_TO_BASE →
                </Link>
                <Link href="/roadmap" style={{
                    background: 'transparent',
                    color: '#f5a623',
                    fontWeight: 900,
                    fontSize: '0.7rem',
                    letterSpacing: '2px',
                    padding: '0.75rem 1.75rem',
                    border: '1px solid rgba(245,166,35,0.4)',
                    borderRadius: '4px',
                    textDecoration: 'none',
                }}>
                    VIEW_ROADMAP
                </Link>
            </div>
        </div>
    );
}
