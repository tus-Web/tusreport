'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import styles from './department.module.css';

// 階層構造のデータ
const hierarchy = {
  department: '情報工学科'
};

// 学年データの配列
const years = [
  { id: 1, title: '1年' },
  { id: 2, title: '2年' },
  { id: 3, title: '3年' },
  { id: 4, title: '4年' },
];

export default function DepartmentPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    // ログインしていない場合はログインページへリダイレクト
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push('/sign-in');
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>読み込み中...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.headerContainer}>
          <div className={styles.header}>
            <div className={styles.hierarchy}>
              <span className={styles.department}>{hierarchy.department}</span>
            </div>
          </div>
        </div>

        <div className={styles.mainContainer}>
          <div className={styles.courseSection}>
            <h3 className={styles.courseTitle}>学年選択</h3>
            <ul className={styles.courseList}>
              {years.map((year) => (
                <li key={year.id} className={styles.courseItem}>
                  <Link href={`/department/${year.id}`} className={styles.courseLink}>
                    <span>{year.title}</span>
                    <span className={styles.arrow}>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
