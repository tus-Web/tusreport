'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import styles from './coming-soon.module.css';

// 授業データの配列
const courses = [
  { id: 1, title: '重力加速度の測定' },
  { id: 2, title: '電気抵抗の測定' },
  { id: 3, title: '光の干渉実験' },
  { id: 4, title: '音波の性質' },
  { id: 5, title: '熱伝導実験' },
];

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

        <div className={styles.courseSection}>
          <h3 className={styles.courseTitle}>実験一覧</h3>
          <ul className={styles.courseList}>
            {courses.map((course) => (
              <li key={course.id} className={styles.courseItem}>
                <a href="#" className={styles.courseLink}>
                  <span>{`第${course.id}回 ${course.title}`}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.comingSoon}>
          <span className={styles.comingText}>Coming</span>
          <span className={styles.soonText}>Soon</span>
        </div>

        <div className={styles.actions}>
          <Link href="/" className={styles.homeButton}>
            ホームへ戻る
          </Link>
        </div>


      </div>
    </div>
  );
}