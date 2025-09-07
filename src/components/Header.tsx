"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'saturate(180%) blur(8px)',
            WebkitBackdropFilter: 'saturate(180%) blur(8px)',
            borderBottom: '1px solid #eef0f3'
        }}>
            <div style={{
                maxWidth: 1200,
                margin: '0 auto',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16
            }}>
                <Link href="/home" style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                }}>
                    <span style={{
                        fontWeight: 800,
                        fontSize: 18,
                        letterSpacing: 0.3,
                        color: '#0f172a'
                    }}>tusreport</span>
                </Link>

                {/* Desktop nav */}
                <nav style={{
                    display: 'none',
                    gap: 20,
                }}
                className="tus-header-desktop-nav">
                    <Link href="/department" style={linkStyle} className="tus-link">Department</Link>
                    <Link href="/setting" style={linkStyle} className="tus-link">Setting</Link>
                    <Link href="/home" style={linkStyle} className="tus-link">Home</Link>
                </nav>

                {/* CTA (desktop) */}
                <div style={{ display: 'none' }} className="tus-header-desktop-cta">
                    <Link href="/setting" style={ctaStyle}>お問い合わせ</Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    aria-label="Toggle navigation"
                    onClick={() => setIsMenuOpen(v => !v)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        border: '1px solid #e5e7eb',
                        background: '#ffffff',
                        color: '#0f172a',
                        cursor: 'pointer'
                    }}
                    className="tus-header-hamburger"
                >
                    <span style={{
                        display: 'block',
                        width: 18,
                        height: 2,
                        background: '#0f172a',
                        position: 'relative'
                    }}>
                        <span style={{
                            display: 'block',
                            width: 18,
                            height: 2,
                            background: '#0f172a',
                            position: 'absolute',
                            top: -6,
                            left: 0
                        }} />
                        <span style={{
                            display: 'block',
                            width: 18,
                            height: 2,
                            background: '#0f172a',
                            position: 'absolute',
                            top: 6,
                            left: 0
                        }} />
                    </span>
                </button>
            </div>

            {/* Mobile menu panel */}
            {isMenuOpen && (
                <div style={{
                    display: 'grid',
                    gap: 8,
                    padding: '8px 16px 16px',
                    background: '#ffffff',
                    borderTop: '1px solid #eef0f3'
                }}>
                    <Link href="/department" style={mobileLinkStyle} className="tus-link" onClick={() => setIsMenuOpen(false)}>Department</Link>
                    <Link href="/setting" style={mobileLinkStyle} className="tus-link" onClick={() => setIsMenuOpen(false)}>Setting</Link>
                    <Link href="/home" style={mobileLinkStyle} className="tus-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link href="/setting" style={{
                        ...ctaStyle,
                        textAlign: 'center',
                        marginTop: 6
                    }} onClick={() => setIsMenuOpen(false)}>お問い合わせ</Link>
                </div>
            )}

            <style>{`
                /* Responsive visibility */
                @media (min-width: 768px) {
                    .tus-header-desktop-nav { display: flex !important; }
                    .tus-header-desktop-cta { display: block !important; }
                    .tus-header-hamburger { display: none !important; }
                }
                @media (max-width: 767px) {
                    .tus-header-desktop-nav { display: none !important; }
                    .tus-header-desktop-cta { display: none !important; }
                    .tus-header-hamburger { display: inline-flex !important; }
                }

                /* Hover underline animation akin to corporate site */
                .tus-link { position: relative; }
                .tus-link:after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: -4px;
                    width: 0%;
                    height: 1px;
                    background: #10B981;
                    transition: width 200ms ease;
                }
                .tus-link:hover { color: #10B981 !important; }
                .tus-link:hover:after { width: 100%; }
            `}</style>
        </header>
    );
}

const linkStyle: CSSProperties = {
    color: '#0f172a',
    textDecoration: 'none',
    fontSize: 14,
    padding: '8px 2px',
    transition: 'color 150ms ease',
    display: 'inline-block'
};

const mobileLinkStyle: CSSProperties = {
    ...linkStyle,
    padding: '10px 2px'
};

const ctaStyle: CSSProperties = {
    textDecoration: 'none',
    background: '#111827',
    color: '#ffffff',
    border: '1px solid #111827',
    padding: '8px 12px',
    fontSize: 13,
    borderRadius: 9999,
    transition: 'all 150ms ease',
    display: 'inline-block'
}; 