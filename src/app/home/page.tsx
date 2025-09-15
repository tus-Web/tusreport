import Image from 'next/image';

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
    <main style={{ display: 'flex', minHeight: '70vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>ようこそ、tusReportへ！</h1>
        <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: '2rem' }}>理科大レポート作成支援ツールです。</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <Image
            src="/assets/undraw_report.svg"
            alt="レポート作成のイラスト"
            width={400}
            height={300}
            style={{ maxWidth: '100%', height: 'auto' }}
            className="svg-illustration"
            priority
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', maxWidth: '800px' }} className="grid-responsive">
        <div className="canDo feature-card" style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#10b981' }}>できること</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {canDoList.map((item, index) => (
              <li key={index} style={{ padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10b981', marginRight: '0.5rem', fontSize: '1.2rem' }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="advantages feature-card" style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#10b981' }}>tusReportの特徴</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {advantagesList.map((item, index) => (
              <li key={index} style={{ padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10b981', marginRight: '0.5rem', fontSize: '1.2rem' }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
} 