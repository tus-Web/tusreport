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

  const experiments = [
    {
      id: '1',
      title: '第１回 重力加速度',
      description: '自由落下実験による重力加速度の測定',
      date: '2025年4月15日',
      deadline: '2025年4月22日',
      status: '未提出',
      available: true
    },
    {
      id: '2',
      title: '第２回 ヤング率の測定',
      description: 'フックの法則を用いたヤング率の測定',
      date: '2025年4月22日',
      deadline: '2025年4月29日',
      status: '未提出',
      available: true
    },
    {
      id: '3',
      title: '第３回 Coming Soon',
      description: '次回の実験内容は準備中です',
      date: '',
      deadline: '',
      status: '',
      available: false
    }
  ];

  const handleExperimentClick = (experimentId: string) => {
    router.push(`/experiments/detail?id=${experimentId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>情報工学科一年</h1>
          <h2 className={styles.subtitle}>工学基礎実験</h2>
        </header>

        <div className={styles.experimentsGrid}>
          {experiments.map((experiment) => (
            <Card 
              key={experiment.id}
              className={`${styles.experimentCard} ${!experiment.available ? styles.comingSoon : ''}`}
            >
              <CardHeader>
                <CardTitle className={styles.cardTitle}>
                  {experiment.title}
                </CardTitle>
                <CardDescription className={styles.cardDescription}>
                  {experiment.description}
                </CardDescription>
              </CardHeader>
              {experiment.available && (
                <>
                  <CardContent>
                    <div className={styles.cardInfo}>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>実施日:</span>
                        <span className={styles.value}>{experiment.date}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>提出期限:</span>
                        <span className={styles.value}>{experiment.deadline}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>ステータス:</span>
                        <span className={styles.statusBadge}>{experiment.status}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className={styles.cardFooter}>
                    <Button 
                      onClick={() => handleExperimentClick(experiment.id)}
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
                        <path d="M9 12l2 2 4-4" />
                        <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
                        <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
                      </svg>
                      レポートテンプレートを見る
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          ))}
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