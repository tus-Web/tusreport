'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SettingPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push('/sign-in');
    }
  }, [isSignedIn, isLoaded, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (!isLoaded) return null;
  if (!isSignedIn) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ display: 'grid', gap: '1rem', textAlign: 'center' }}>
        <h1>設定</h1>
        <p>{user?.primaryEmailAddress?.emailAddress}</p>
        <Button onClick={handleLogout} variant="outline">
          ログアウト
        </Button>
        <Link href="/home"><Button variant="outline">ホームへ戻る</Button></Link>
      </div>
    </div>
  );
}