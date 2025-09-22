'use client';

import { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { validateTusEmail } from '@/lib/validations';

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    verificationCode?: string;
    general?: string;
  }>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;

    setIsLoading(true);
    setErrors({});

    // メールアドレスの形式をバリデーション
    if (!validateTusEmail(email)) {
      setErrors({
        email: '学生番号（数字）@ed.tus.ac.jp の形式で入力してください'
      });
      setIsLoading(false);
      return;
    }

    if (!password) {
      setErrors({
        password: 'パスワードを入力してください'
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrors({
        password: 'パスワードは8文字以上で入力してください'
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrors({
        confirmPassword: 'パスワードが一致しません'
      });
      setIsLoading(false);
      return;
    }

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      console.error('Sign up error:', err);
      
      if (err.errors) {
        const clerkErrors = err.errors[0];
        if (clerkErrors.code === 'form_password_pwned') {
          setErrors({
            password: 'このパスワードは安全ではありません。別のパスワードを使用してください。'
          });
        } else if (clerkErrors.code === 'form_identifier_exists') {
          setErrors({
            email: 'このメールアドレスは既に登録されています'
          });
        } else {
          setErrors({
            general: 'サインアップに失敗しました。もう一度お試しください。'
          });
        }
      } else {
        setErrors({
          general: 'サインアップに失敗しました。もう一度お試しください。'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;

    setIsLoading(true);
    setErrors({});

    if (!verificationCode) {
      setErrors({
        verificationCode: '認証コードを入力してください'
      });
      setIsLoading(false);
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push('/');
      } else {
        console.log('Verification status:', completeSignUp.status);
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      
      if (err.errors) {
        const clerkErrors = err.errors[0];
        if (clerkErrors.code === 'form_code_incorrect') {
          setErrors({
            verificationCode: '認証コードが正しくありません'
          });
        } else {
          setErrors({
            general: '認証に失敗しました。もう一度お試しください。'
          });
        }
      } else {
        setErrors({
          general: '認証に失敗しました。もう一度お試しください。'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // リアルタイムバリデーション
    if (value && !validateTusEmail(value)) {
      setErrors(prev => ({
        ...prev,
        email: '学生番号（数字）@ed.tus.ac.jp の形式で入力してください'
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        email: undefined
      }));
    }
  };

  if (pendingVerification) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: '#ffffff'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2rem',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              メール認証
            </h1>
            <p style={{
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              {email} に送信された認証コードを入力してください
            </p>
          </div>

          <form onSubmit={handleVerification} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="verificationCode" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                認証コード
              </label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="6桁のコードを入力"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${errors.verificationCode ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '6px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  textAlign: 'center',
                  letterSpacing: '0.2em'
                }}
              />
              {errors.verificationCode && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem'
                }}>
                  {errors.verificationCode}
                </p>
              )}
            </div>

            {errors.general && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                color: '#dc2626',
                fontSize: '0.875rem'
              }}>
                {errors.general}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !verificationCode}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: isLoading || !verificationCode ? '#9ca3af' : '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: isLoading || !verificationCode ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              {isLoading ? '認証中...' : '認証する'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      background: '#ffffff'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            サインアップ
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            東京理科大学のメールアドレスでアカウントを作成してください
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="email" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="学生番号@ed.tus.ac.jp"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '6px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
            {errors.email && (
              <p style={{
                color: '#ef4444',
                fontSize: '0.75rem',
                marginTop: '0.25rem'
              }}>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上のパスワード"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.password ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '6px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
            {errors.password && (
              <p style={{
                color: '#ef4444',
                fontSize: '0.75rem',
                marginTop: '0.25rem'
              }}>
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              パスワード（確認）
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="パスワードを再度入力"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.confirmPassword ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '6px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
            {errors.confirmPassword && (
              <p style={{
                color: '#ef4444',
                fontSize: '0.75rem',
                marginTop: '0.25rem'
              }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {errors.general && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              color: '#dc2626',
              fontSize: '0.875rem'
            }}>
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email || !password || !confirmPassword}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: isLoading || !email || !password || !confirmPassword ? '#9ca3af' : '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: isLoading || !email || !password || !confirmPassword ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            {isLoading ? 'アカウント作成中...' : 'アカウントを作成'}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          既にアカウントをお持ちの場合は{' '}
          <a
            href="/sign-in"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            サインイン
          </a>
        </div>
      </div>
    </div>
  );
}