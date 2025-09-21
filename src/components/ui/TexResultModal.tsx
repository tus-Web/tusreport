'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import styles from './TexResultModal.module.css';

interface TexResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  texCode: string;
  experimentTitle: string;
  onRegenerate: () => void;
  isLoading?: boolean;
}

export function TexResultModal({ 
  isOpen, 
  onClose, 
  texCode, 
  experimentTitle, 
  onRegenerate, 
  isLoading = false 
}: TexResultModalProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(texCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([texCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${experimentTitle.replace(/\s+/g, '_')}_report.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContainer}>
        <Card className={styles.modalCard}>
          <CardHeader className={styles.modalHeader}>
            <div className={styles.headerContent}>
              <CardTitle className={styles.modalTitle}>
                🎉 TeXコード生成完了！
              </CardTitle>
              <button 
                onClick={onClose}
                className={styles.closeButton}
                disabled={isLoading}
              >
                ✕
              </button>
            </div>
            <p className={styles.modalSubtitle}>
              {experimentTitle}のレポートテンプレートが生成されました
            </p>
          </CardHeader>
          
          <CardContent className={styles.modalContent}>
            {/* TeXコードプレビュー */}
            <div className={styles.codePreview}>
              <div className={styles.codeHeader}>
                <span className={styles.codeTitle}>生成されたTeXコード</span>
                <span className={styles.codeLines}>
                  {texCode.split('\n').length} 行
                </span>
              </div>
              <pre className={styles.codeBlock}>
                <code>{texCode.length > 500 ? texCode.substring(0, 500) + '...' : texCode}</code>
              </pre>
            </div>

            {/* アクションボタン */}
            <div className={styles.actionButtons}>
              <Button
                onClick={handleCopy}
                className={`${styles.actionButton} ${copySuccess ? styles.successButton : ''}`}
                size="lg"
                disabled={isLoading}
              >
                {copySuccess ? (
                  <>
                    <svg className={styles.buttonIcon} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    コピー完了！
                  </>
                ) : (
                  <>
                    <svg className={styles.buttonIcon} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    コピーする
                  </>
                )}
              </Button>

              <Button
                onClick={handleDownload}
                variant="outline"
                className={styles.actionButton}
                size="lg"
                disabled={isLoading}
              >
                <svg className={styles.buttonIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                ダウンロード
              </Button>

              <Button
                onClick={onRegenerate}
                variant="outline"
                className={styles.actionButton}
                size="lg"
                disabled={isLoading}
              >
                <svg className={styles.buttonIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                {isLoading ? '再生成中...' : '再生成'}
              </Button>
            </div>

            {/* 使い方の説明 */}
            <div className={styles.instructions}>
              <h4 className={styles.instructionsTitle}>📝 使い方</h4>
              <ol className={styles.instructionsList}>
                <li>「コピーする」ボタンでTeXコードをクリップボードにコピー</li>
                <li>LaTeX環境（Overleaf、TeXShop等）に貼り付け</li>
                <li>必要に応じて内容を編集・追記してレポートを完成</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}