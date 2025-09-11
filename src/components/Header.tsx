"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/home" className={styles.logo}>
                    <span className={styles.tus}>tus</span>
                    <span className={styles.logoText}>Report</span>
                </Link>

                {/* Desktop nav */}
                <nav className={styles.desktopNav}>
                    <Link href="/department" className={styles.link}>情報工学科</Link>
                    <Link href="/setting" className={styles.link}>設定</Link>
                </nav>

                {/* CTA (desktop) */}
                <div className={styles.desktopCta}>
                    <Link href="/contact" className={styles.ctaButton}>お問い合わせ</Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    aria-label="Toggle navigation"
                    onClick={() => setIsMenuOpen(v => !v)}
                    className={styles.hamburger}
                >
                    <span className={styles.hamburgerLine}></span>
                </button>
            </div>

            {/* Mobile menu panel */}
            {isMenuOpen && (
                <div className={styles.mobileMenu}>
                    <Link href="/department" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Department</Link>
                    <Link href="/setting" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Setting</Link>
                    <Link href="/home" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link href="/setting" className={styles.mobileCta} onClick={() => setIsMenuOpen(false)}>お問い合わせ</Link>
                </div>
            )}
        </header>
    );
} 