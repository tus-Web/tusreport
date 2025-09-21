import React from 'react';
import Image from 'next/image';

export default function ContactPage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>お問い合わせ</h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <Image
            src="/assets/undraw_contact-us.svg"
            alt="お問い合わせのイラスト"
            width={350}
            height={250}
            style={{ maxWidth: '100%', height: 'auto' }}
            className="svg-illustration"
            priority
          />
        </div>
        
        <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '1.5rem' }}>
            ご質問やご意見がございましたら、<br />以下のメールアドレスまでご連絡ください。
          </p>
          <div style={{ background: '#10b981', color: 'white', padding: '1rem', borderRadius: '8px', display: 'inline-block' }}>
            <a 
              href="mailto:tus.genesis@gmail.com" 
              style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontSize: '1.1rem', 
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>✉</span>
              tus.genesis@gmail.com
            </a>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginTop: '1rem' }}>
            お気軽にお問い合わせください。できる限り迅速に対応いたします。
          </p>
        </div>
      </div>
    </div>
  );
}