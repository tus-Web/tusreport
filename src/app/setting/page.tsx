'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SettingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  if (status === 'loading') return null;
  if (!session) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ display: 'grid', gap: '1rem', textAlign: 'center' }}>
        <h1>設定</h1>
        <p>{session.user?.email}</p>
        <Button onClick={handleLogout} variant="outline">
          ログアウト
        </Button>
        <Link href="/home"><Button variant="outline">ホームへ戻る</Button></Link>
      </div>
    </div>
  );
} 