'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

// 階層構造のデータ
const hierarchy = {
  department: '情報工学科',
  year: '1年',
  course: '工学基礎実験'
};

// 授業データの配列
const courses = [
  { id: 1, title: '重力加速度の測定' },
  { id: 2, title: '電気抵抗の測定' },
  { id: 3, title: '光の干渉実験' },
  { id: 4, title: '音波の性質' },
  { id: 5, title: '熱伝導実験' },
];

export default function Year1Page() {
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
        <div className={styles.headerContainer}>
          <div className={styles.header}>
            <div className={styles.hierarchy}>
              <span className={styles.department}>{hierarchy.department}</span>
              <span className={styles.separator}> ＞ </span>
              <span className={styles.year}>{hierarchy.year}</span>
              <span className={styles.separator}> ＞ </span>
              <span className={styles.course}>{hierarchy.course}</span>
            </div>
            <div className={styles.actions}>
              <Link href="/department" className={styles.homeButton}>
                学科へ戻る
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.mainContainer}>
          <div className={styles.courseSection}>
            <h3 className={styles.courseTitle}>実験一覧</h3>
            <ul className={styles.courseList}>
              {courses.map((course) => (
                <li key={course.id} className={styles.courseItem}>
                  <Link href={`/department/1/detail?id=${course.id}`} className={styles.courseLink}>
                    <span>{`第${course.id}回 ${course.title}`}</span>
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
