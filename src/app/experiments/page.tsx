'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import styles from './experiments.module.css';

export default function ExperimentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
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

  const handleDownload = () => {
    alert('レポートテンプレートのダウンロード機能は準備中です');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>情報工学科一年</h1>
          <h2 className={styles.subtitle}>工学基礎実験</h2>
        </header>

        <div className={styles.experimentsGrid}>
          <Card className={styles.experimentCard}>
            <CardHeader>
              <CardTitle className={styles.cardTitle}>
                第１回 重力加速度
              </CardTitle>
              <CardDescription className={styles.cardDescription}>
                自由落下実験による重力加速度の測定
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={styles.cardInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>実施日:</span>
                  <span className={styles.value}>2025年4月15日</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>提出期限:</span>
                  <span className={styles.value}>2025年4月22日</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>ステータス:</span>
                  <span className={styles.statusBadge}>未提出</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className={styles.cardFooter}>
              <Button 
                onClick={handleDownload}
                variant="gradient"
                className={styles.downloadButton}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.downloadIcon}
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                テンプレートをダウンロード
              </Button>
            </CardFooter>
          </Card>

          {/* 今後の実験用のプレースホルダー */}
          <Card className={`${styles.experimentCard} ${styles.comingSoon}`}>
            <CardHeader>
              <CardTitle className={styles.cardTitle}>
                第２回 Coming Soon
              </CardTitle>
              <CardDescription className={styles.cardDescription}>
                次回の実験内容は準備中です
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className={`${styles.experimentCard} ${styles.comingSoon}`}>
            <CardHeader>
              <CardTitle className={styles.cardTitle}>
                第３回 Coming Soon
              </CardTitle>
              <CardDescription className={styles.cardDescription}>
                次回の実験内容は準備中です
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className={styles.navigation}>
          <Link href="/coming-soon">
            <Button variant="outline">戻る</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}