'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './verify.module.css';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'pending' | 'verifying' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    if (!token) return;
    
    setStatus('verifying');
    
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('メールアドレスの認証が完了しました！');
        setTimeout(() => {
          router.push('/coming-soon');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || '認証に失敗しました');
      }
    } catch (error) {
      setStatus('error');
      setMessage('認証処理中にエラーが発生しました');
    }
  };

  const resendEmail = async () => {
    if (!email) return;
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('認証メールを再送信しました');
      } else {
        setMessage(data.error || '再送信に失敗しました');
      }
    } catch (error) {
      setMessage('再送信中にエラーが発生しました');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {status === 'pending' && !token && (
          <>
            <div className={styles.icon}>📧</div>
            <h1 className={styles.title}>メール認証</h1>
            <p className={styles.description}>
              {email ? (
                <>
                  <strong>{email}</strong> に認証メールを送信しました。
                  <br />
                  メール内のリンクをクリックして認証を完了してください。
                </>
              ) : (
                'メールアドレスの認証が必要です。'
              )}
            </p>
            
            {email && (
              <button onClick={resendEmail} className={styles.resendButton}>
                認証メールを再送信
              </button>
            )}
            
            {message && (
              <div className={styles.message}>
                {message}
              </div>
            )}
          </>
        )}

        {status === 'verifying' && (
          <>
            <div className={styles.spinner}></div>
            <h1 className={styles.title}>認証中...</h1>
            <p className={styles.description}>
              メールアドレスを認証しています。しばらくお待ちください。
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className={styles.icon}>✅</div>
            <h1 className={styles.title}>認証完了！</h1>
            <p className={styles.description}>
              {message}
              <br />
              3秒後に次のページへ移動します。
            </p>
            <Link href="/coming-soon" className={styles.button}>
              次へ進む
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className={styles.icon}>❌</div>
            <h1 className={styles.title}>認証エラー</h1>
            <p className={styles.description}>
              {message}
            </p>
            <div className={styles.actions}>
              <Link href="/auth/signup" className={styles.button}>
                新規登録へ戻る
              </Link>
              <Link href="/auth/login" className={styles.buttonOutline}>
                ログインページへ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}