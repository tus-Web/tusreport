'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import styles from './signup.module.css';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showDevModal, setShowDevModal] = useState(false);
  const [devPassword, setDevPassword] = useState('');
  const [devError, setDevError] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@ed\.tus\.ac\.jp$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // バリデーション
    if (!validateEmail(formData.email)) {
      setError('@ed.tus.ac.jpのメールアドレスのみ登録可能です');
      return;
    }

    if (formData.password.length < 8) {
      setError('パスワードは8文字以上で設定してください');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '登録に失敗しました');
      }

      // 認証メール送信成功
      router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : '登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevSubmit = async () => {
    setDevError('');

    try {
      const response = await fetch('/api/auth/dev-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          devPassword: devPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '開発者モードでの登録に失敗しました');
      }

      // アカウント作成成功、自動ログイン
      const loginResult = await signIn('credentials', {
        email: data.email,
        password: data.testPassword,
        redirect: false,
      });

      if (loginResult?.error) {
        throw new Error('自動ログインに失敗しました');
      }

      // ログイン成功、次のページへ
      alert(`開発用アカウント作成完了\nメール: ${data.email}\nパスワード: ${data.testPassword}\n\n次のページへ移動します`);
      router.push('/coming-soon');
      router.refresh();
    } catch (error) {
      setDevError(error instanceof Error ? error.message : '開発者モードでの登録に失敗しました');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>新規登録</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="your-email@ed.tus.ac.jp"
              required
              disabled={isLoading}
            />
            <span className={styles.hint}>
              ※ @ed.tus.ac.jpのメールアドレスのみ登録可能です
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="8文字以上で入力"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              パスワード（確認）
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.input}
              placeholder="パスワードを再入力"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? '登録中...' : '登録する'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>すでにアカウントをお持ちの方は</p>
          <Link href="/auth/login" className={styles.link}>
            ログイン
          </Link>
        </div>

        {/* 開発者モード */}
        {process.env.NODE_ENV === 'development' && (
          <div className={styles.devMode}>
            <button
              type="button"
              onClick={() => setShowDevModal(true)}
              className={styles.devButton}
            >
              🔧 開発者モード（認証スキップ）
            </button>
          </div>
        )}
      </div>

      {/* 開発者モードモーダル */}
      {showDevModal && (
        <div className={styles.modal} onClick={() => setShowDevModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>開発者モード</h2>
            <p>開発者パスワードを入力してください</p>
            <input
              type="password"
              value={devPassword}
              onChange={(e) => setDevPassword(e.target.value)}
              className={styles.input}
              placeholder="開発者パスワード"
              autoFocus
            />
            {devError && (
              <div className={styles.error}>
                {devError}
              </div>
            )}
            <div className={styles.modalButtons}>
              <button
                type="button"
                onClick={() => setShowDevModal(false)}
                className={styles.cancelButton}
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleDevSubmit}
                className={styles.confirmButton}
              >
                確認
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}