'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  // ログイン済みユーザーは自動的にcoming-soonページへリダイレクト
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/coming-soon');
    }
  }, [status, session, router]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>TUS Report System</h1>
          <p className={styles.subtitle}>東京理科大学レポート管理システム</p>
        </div>

        {status === 'loading' ? (
          <div className={styles.loading}>読み込み中...</div>
        ) : session ? (
          <div className={styles.userSection}>
            <div className={styles.welcomeMessage}>
              ようこそ、{session.user?.name || session.user?.email}さん
            </div>
            <div className={styles.userInfo}>
              <p>メールアドレス: {session.user?.email}</p>
            </div>
            <button onClick={handleLogout} className={styles.logoutButton}>
              ログアウト
            </button>
          </div>
        ) : (
          <div className={styles.authSection}>
            <p className={styles.description}>
              @ed.tus.ac.jpのメールアドレスでログインしてください
            </p>
            <div className={styles.ctas}>
              <Link href="/auth/login" className={styles.primary}>
                ログイン
              </Link>
              <Link href="/auth/signup" className={styles.secondary}>
                新規登録
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 TUS Report System. All rights reserved.</p>
      </footer>
    </div>
  );
}
