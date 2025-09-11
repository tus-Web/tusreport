'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  // ログイン済みユーザーは自動的にdepartmentページへリダイレクト
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/department');
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>TUS Report System</h1>
          <p className={styles.subtitle}>東京理科大学レポート管理システム</p>
        </div>

        {!isLoaded ? (
          <div className={styles.loading}>読み込み中...</div>
        ) : isSignedIn ? (
          <div className={styles.userSection}>
            <div className={styles.welcomeMessage}>
              ようこそ、{user?.firstName || user?.primaryEmailAddress?.emailAddress}さん
            </div>
            <div className={styles.userInfo}>
              <p>メールアドレス: {user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            <button onClick={handleLogout} className={styles.logoutButton}>
              ログアウト
            </button>
          </div>
        ) : (
          <div className={styles.authSection}>
            <p className={styles.description}>
              システムを利用するにはログインが必要です
            </p>
            <div className={styles.authButtons}>
              <Link href="/sign-in" className={styles.authButton}>
                ログイン
              </Link>
              <Link href="/sign-up" className={styles.authButton}>
                新規登録
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}