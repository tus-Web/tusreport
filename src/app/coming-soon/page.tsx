'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import styles from './coming-soon.module.css';

export default function ComingSoonPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // ログインしていない場合はログインページへリダイレクト
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>読み込み中...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.department}>情報工学科一年</h1>
          <h2 className={styles.course}>工学基礎実験</h2>
        </div>
        
        <div className={styles.comingSoon}>
          <span className={styles.comingText}>Coming</span>
          <span className={styles.soonText}>Soon</span>
        </div>

        <div className={styles.message}>
          <p>このページは現在準備中です</p>
          <p className={styles.subMessage}>まもなく公開予定</p>
        </div>

        <div className={styles.userInfo}>
          <p>ログイン中: {session.user?.email}</p>
        </div>

        <div className={styles.actions}>
          <Link href="/" className={styles.homeButton}>
            ホームへ戻る
          </Link>
        </div>

        <div className={styles.experimentSection}>
          <Link href="/experiments">
            <Button 
              variant="gradient" 
              size="lg"
              className={styles.experimentButton}
            >
              実験を開始する →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}