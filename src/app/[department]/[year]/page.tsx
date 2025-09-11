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
  { id: 1, title: '重力加速度', url: 'gravity' },
  { id: 2, title: 'ヤング率の測定', url: 'youngs-modulus' },
  { id: 3, title: 'フランク・ヘルツの実験', url: 'frank-hertz' },
  { id: 4, title: '光の回折', url: 'light-diffraction' },
  { id: 5, title: '電気抵抗の温度係数の計測', url: 'temperature-coefficient' },
  { id: 6, title: '金属の融点の測定', url: 'melting-point' },
  { id: 7, title: '放射線計測', url: 'radiation-measurement' },
  { id: 8, title: '実体振り子', url: 'physical-pendulum' },
  { id: 9, title: '弦の共振', url: 'string-resonance' },
  { id: 10, title: 'オシロスコープ', url: 'oscilloscope' },
  { id: 11, title: 'PC分解実験', url: 'pc-disassembly' }
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
              <Link href="/department" style={{ textDecoration: 'underline' }} className={styles.departmentLink}>
                <span className={styles.department}>{hierarchy.department}</span>
              </Link>
              <span className={styles.separator}> ＞ </span>
              <Link href="/department/1" style={{ textDecoration: 'underline' }} className={styles.yearLink}>
                <span className={styles.year}>{hierarchy.year}</span>
              </Link>
              <span className={styles.separator}> ＞ </span>
              <span className={styles.course}>{hierarchy.course}</span>
            </div>
          </div>
        </div>

        <div className={styles.mainContainer}>
          <div className={styles.courseSection}>
            <h3 className={styles.courseTitle}>実験一覧</h3>
            <ul className={styles.courseList}>
              {courses.map((course) => (
                <li key={course.id} className={styles.courseItem}>
                  <Link href={`/department/1/${course.url}`} className={styles.courseLink}>
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
