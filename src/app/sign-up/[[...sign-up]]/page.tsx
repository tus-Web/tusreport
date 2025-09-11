'use client';

import { SignUp } from "@clerk/nextjs";
import { useState, useEffect } from "react";

// 許可するメールドメイン
const ALLOWED_DOMAIN = 'ed.tus.ac.jp';

export default function SignUpPage() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // メールフィールドの入力を監視するための処理
    const checkEmailDomain = () => {
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      if (emailInput) {
        emailInput.addEventListener('blur', () => {
          const email = emailInput.value;
          if (email && !email.endsWith(`@${ALLOWED_DOMAIN}`)) {
            setShowWarning(true);
          } else {
            setShowWarning(false);
          }
        });
      }
    };

    // DOMが完全に読み込まれるのを待つ
    const timer = setTimeout(checkEmailDomain, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      background: '#ffffff'
    }}>
      {showWarning && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <strong>注意：</strong>@{ALLOWED_DOMAIN}のメールアドレスのみ登録可能です。
        </div>
      )}
      
      <SignUp 
        appearance={{
          elements: {
            rootBox: {
              width: '100%',
              maxWidth: '450px'
            },
            card: {
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px'
            },
            headerTitle: {
              fontSize: '24px',
              fontWeight: 'bold'
            },
            headerSubtitle: {
              fontSize: '14px',
              color: '#666'
            },
            formFieldLabel: {
              fontSize: '14px',
              fontWeight: '500'
            },
            formFieldInput: {
              fontSize: '16px',
              borderRadius: '6px'
            },
            formButtonPrimary: {
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '32px',
              background: '#000000',
              '&:hover': {
                background: '#333333'
              }
            },
            footerActionLink: {
              color: '#000000',
              fontWeight: '600',
              '&:hover': {
                color: '#333333'
              }
            }
          },
          layout: {
            socialButtonsVariant: 'blockButton',
            socialButtonsPlacement: 'bottom'
          }
        }}
        localization={{
          formFieldLabel__emailAddress: 'メールアドレス（@ed.tus.ac.jpのみ）',
          formFieldInputPlaceholder__emailAddress: 'your-email@ed.tus.ac.jp',
          formFieldError__emailAddress: '有効なメールアドレスを入力してください',
        }}
      />
      
      <div style={{
        marginTop: '1rem',
        fontSize: '14px',
        color: '#666',
        textAlign: 'center'
      }}>
        ※ @{ALLOWED_DOMAIN}のメールアドレスのみ登録できます
      </div>
    </div>
  );
}