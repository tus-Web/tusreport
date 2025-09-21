import Image from 'next/image';
import Link from 'next/link';
import CustomButton from '@/components/ui/custom-button';
import styles from './page.module.css';

//　配列にして、mapで回す形にしたい
const canDoList = [
  'エクセルファイルのダウンロード',
  'レポートの自動生成',
];

const advantagesList = [
  'レポートのテンプレートを簡単に作成・管理',
  'ドラッグ＆ドロップで直感的に操作可能',
];

export default function HomePage() {
  return (
    <main className={styles.container}>
      {/* メインコンテンツエリア */}
      <div className={styles.mainContent}>
        {/* 左側：画像 */}
        <div className={styles.imageSection}>
          <Image
            src="/assets/undraw_report.svg"
            alt="レポート作成のイラスト"
            width={500}
            height={400}
            style={{ maxWidth: '100%', height: 'auto' }}
            className="svg-illustration"
            priority
          />
        </div>

        {/* 右側：タイトル、できること、特徴 */}
        <div className={styles.contentSection}>
          {/* タイトルセクション */}
          <div className={styles.titleSection}>
            <h1>
              <span style={{fontSize: '2rem'}}>ようこそ</span><br /><span style={{ color: '#10b981' }}>tus</span>Reportへ！
            </h1>
            <p>
              理科大レポート作成支援ツールです。
            </p>
          </div>

          {/* できること・特徴のセクション */}
          <div className={styles.featuresContainer}>
            {/* できること */}
            <div className={styles.featureCard}>
              <h2>できること</h2>
              <ul>
                {canDoList.map((item, index) => (
                  <li key={index}>
                    <span className={styles.checkIcon}>✓</span>
                    <span className={styles.featureText}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 特徴 */}
            <div className={styles.featureCard}>
              <h2>tusReportの特徴</h2>
              <ul>
                {advantagesList.map((item, index) => (
                  <li key={index}>
                    <span className={styles.checkIcon}>✓</span>
                    <span className={styles.featureText}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTAボタンエリア */}
      <div className={styles.ctaSection}>
        <Link href="/department">
          <CustomButton className={styles.ctaButton}>
            レポート作成を始める
          </CustomButton>
        </Link>
      </div>
    </main>
  );
} 