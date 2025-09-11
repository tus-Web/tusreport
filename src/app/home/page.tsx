import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
    <main style={{ display: 'flex', minHeight: '70vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <h1>ようこそ、tusReportへ！</h1>
      <p>理科大レポート作成支援ツールです。</p>
      <div className="canDo">
        <h2>できること</h2>
        <ul>
          {canDoList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="advantages">
        <h2>tusReportの特徴</h2>
        <ul>
          {advantagesList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </main>
  );
} 