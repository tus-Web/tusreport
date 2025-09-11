"use client";

import Link from "next/link";
import { useState } from "react";
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
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
                    <SignedIn>
                        <Link href="/department" className={styles.link}>情報工学科</Link>
                        <Link href="/setting" className={styles.link}>設定</Link>
                    </SignedIn>
                </nav>

                {/* CTA (desktop) */}
                <div className={styles.desktopCta}>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className={styles.ctaButton}>ログイン</button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <button className={styles.ctaButton}>新規登録</button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <Link href="/contact" className={styles.ctaButton}>お問い合わせ</Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
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
                    <SignedIn>
                        <Link href="/department" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Department</Link>
                        <Link href="/setting" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Setting</Link>
                        <Link href="/home" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link href="/contact" className={styles.mobileCta} onClick={() => setIsMenuOpen(false)}>お問い合わせ</Link>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className={styles.mobileCta}>ログイン</button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <button className={styles.mobileCta}>新規登録</button>
                        </SignUpButton>
                    </SignedOut>
                </div>
            )}
        </header>
    );
}