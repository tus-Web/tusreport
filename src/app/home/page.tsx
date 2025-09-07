import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main style={{ display: 'flex', minHeight: '70vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <h1>Home</h1>
      <Link href="/department">
        <Button>
          情報工学科
        </Button>
      </Link>
    </main>
  );
} 