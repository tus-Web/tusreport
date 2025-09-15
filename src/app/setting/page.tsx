'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>設定</h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <Image
            src="/assets/undraw_settings.svg"
            alt="設定のイラスト"
            width={300}
            height={250}
            style={{ maxWidth: '100%', height: 'auto' }}
            className="svg-illustration"
            priority
          />
        </div>
        
        <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: '#10b981', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '1rem',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              {user?.primaryEmailAddress?.emailAddress?.charAt(0).toUpperCase()}
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Button 
            onClick={handleLogout} 
            variant="outline"
            className="button-hover"
            style={{ 
              background: '#ef4444', 
              color: 'white', 
              border: 'none',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
          >
            ログアウト
          </Button>
          
          <Link href="/home">
            <Button 
              variant="outline"
              className="button-hover"
              style={{ 
                background: '#10b981', 
                color: 'white', 
                border: 'none',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                borderRadius: '8px',
                width: '100%',
                transition: 'all 0.2s'
              }}
            >
              ホームへ戻る
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}