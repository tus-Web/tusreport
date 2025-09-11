import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700 }}>ページが見つかりません</h1>
        <p style={{ color: '#6b7280' }}>お探しのページは削除されたか、URLが間違っている可能性があります。</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/">
            <Button variant="outline">ホームへ戻る</Button>
          </Link>
        </div>
      </div>
    </main>
  );
} 